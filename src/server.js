require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const AIAssistant = require('./ai/assistant');
const OrderManager = require('./orders/manager');
const MercadoPagoIntegration = require('./payments/mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Inicializar servicios
const aiAssistant = new AIAssistant(process.env.ANTHROPIC_API_KEY);
const orderManager = new OrderManager();
const mercadoPago = new MercadoPagoIntegration(process.env.MERCADOPAGO_ACCESS_TOKEN);

// Verificar configuración de Twilio (opcional)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('✅ Twilio configurado');
} else {
  console.log('⚠️  Twilio no configurado - WhatsApp no disponible (solo modo test)');
}

// Endpoint de salud
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'La Parmesana WhatsApp Bot',
    version: '1.0.0'
  });
});

// Webhook principal para mensajes de WhatsApp
app.post('/whatsapp', async (req, res) => {
  try {
    // Verificar que Twilio esté configurado
    if (!twilioClient) {
      return res.status(503).json({ 
        error: 'WhatsApp no configurado. Configure TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN en .env' 
      });
    }

    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From; // formato: whatsapp:+52...
    const phoneNumber = fromNumber.replace('whatsapp:', '');

    console.log(`📱 Mensaje de ${phoneNumber}: ${incomingMessage}`);

    // Procesar con IA
    const aiResponse = await aiAssistant.processMessage(phoneNumber, incomingMessage);

    // Enviar respuesta por WhatsApp
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    // Logging
    console.log(`🤖 Respuesta: ${aiResponse.substring(0, 100)}...`);

    // Responder a Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Disculpa, hubo un error. Por favor intenta de nuevo o llama al 828-284-0040');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

// Endpoint para confirmar pedido
app.post('/whatsapp/confirm-order', async (req, res) => {
  try {
    const { phoneNumber, orderId } = req.body;
    
    const order = await orderManager.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Marcar como confirmado
    await orderManager.confirmOrder(orderId);

    // Notificar al restaurante (aquí podrías enviar SMS, email, etc.)
    console.log(`✅ Pedido ${orderId} confirmado para ${phoneNumber}`);

    res.json({ success: true, order });

  } catch (error) {
    console.error('Error confirmando pedido:', error);
    res.status(500).json({ error: 'Error confirmando pedido' });
  }
});

// Endpoint para cancelar pedido
app.post('/whatsapp/cancel-order', async (req, res) => {
  try {
    const { phoneNumber, orderId } = req.body;
    
    await orderManager.cancelOrder(orderId);
    
    // Enviar mensaje de confirmación
    if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
      await twilioClient.messages.create({
        body: '❌ Tu pedido ha sido cancelado. Si necesitas algo más, estamos aquí para ayudarte. 😊',
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phoneNumber}`
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error cancelando pedido:', error);
    res.status(500).json({ error: 'Error cancelando pedido' });
  }
});

// Endpoint para obtener resumen de pedido actual
app.get('/whatsapp/order-summary/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    
    const summary = await aiAssistant.extractOrderSummary(phoneNumber);
    
    res.json({ summary });

  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    res.status(500).json({ error: 'Error obteniendo resumen' });
  }
});

// Endpoint para limpiar conversación
app.post('/whatsapp/clear/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    
    aiAssistant.clearHistory(phoneNumber);
    
    res.json({ success: true, message: 'Conversación limpiada' });

  } catch (error) {
    console.error('Error limpiando conversación:', error);
    res.status(500).json({ error: 'Error limpiando conversación' });
  }
});

// Endpoint para enviar mensaje proactivo (promociones, recordatorios)
app.post('/whatsapp/send-message', async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(503).json({ 
        error: 'WhatsApp no configurado' 
      });
    }

    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'phoneNumber y message son requeridos' });
    }

    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`
    });

    res.json({ 
      success: true, 
      messageSid: response.sid 
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ error: 'Error enviando mensaje' });
  }
});

// Endpoint para generar link de pago
app.post('/payment/generate', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId es requerido' });
    }

    // Obtener pedido
    const order = await orderManager.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Generar link de pago
    const paymentResult = await mercadoPago.generarLinkPago(order);

    if (!paymentResult.success) {
      return res.status(500).json({ error: paymentResult.error });
    }

    // Generar mensaje para WhatsApp
    const message = mercadoPago.generarMensajePago(order, paymentResult.paymentLink);

    // Enviar mensaje por WhatsApp
    if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${order.phoneNumber}`
      });
      console.log('📱 Mensaje enviado por WhatsApp');
    } else {
      console.log('⚠️  WhatsApp no configurado - mensaje no enviado');
      console.log('📝 Mensaje que se enviaría:', message);
    }

    res.json({
      success: true,
      paymentLink: paymentResult.paymentLink,
      message: 'Link de pago enviado por WhatsApp'
    });

  } catch (error) {
    console.error('Error generando pago:', error);
    res.status(500).json({ error: 'Error generando link de pago' });
  }
});

// Webhook de Mercado Pago
app.post('/webhooks/mercadopago', async (req, res) => {
  try {
    console.log('📩 Webhook de Mercado Pago recibido');

    const notification = req.body;

    // Procesar webhook
    const paymentInfo = await mercadoPago.procesarWebhook(notification);

    if (paymentInfo.success && paymentInfo.approved) {
      // Pago aprobado - actualizar pedido
      const orderId = paymentInfo.orderId;
      
      if (orderId) {
        const order = await orderManager.getOrder(orderId);
        
        if (order) {
          // Marcar como pagado y confirmar
          await orderManager.updateOrderStatus(orderId, 'confirmed');
          order.paid = true;
          order.paymentMethod = 'mercadopago';
          order.paymentId = notification.data.id;

          console.log(`✅ Pedido ${orderId} pagado y confirmado`);

          // Enviar confirmación por WhatsApp
          const message = mercadoPago.generarMensajePagoExitoso(order);
          
          if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
            await twilioClient.messages.create({
              body: message,
              from: process.env.TWILIO_WHATSAPP_NUMBER,
              to: `whatsapp:${order.phoneNumber}`
            });
            console.log('📱 Confirmación enviada por WhatsApp');
          } else {
            console.log('⚠️  WhatsApp no configurado - confirmación no enviada');
            console.log('📝 Mensaje:', message);
          }

          // TODO: Notificar al restaurante (email, SMS, app, etc.)
          console.log(`🍕 NUEVO PEDIDO PAGADO - Notificar al restaurante: ${orderId}`);
        }
      }
    }

    // Siempre responder 200 a Mercado Pago
    res.status(200).send('OK');

  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(200).send('OK'); // Aún así responder OK para no reintentar
  }
});

// Páginas de redirección después del pago
app.get('/payment/success', async (req, res) => {
  const { collection_id, external_reference } = req.query;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pago Exitoso - La Parmesana</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        h1 { color: #2ecc71; }
        .order-id {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
        }
        .btn {
          background: #2ecc71;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p>Tu pedido ha sido confirmado y está siendo preparado.</p>
        <div class="order-id">
          Pedido #${external_reference}
        </div>
        <p>Recibirás una notificación por WhatsApp cuando esté listo.</p>
        <p><strong>Tiempo estimado: 30-45 minutos</strong></p>
        <br>
        <p style="color: #666; font-size: 14px;">
          📞 828-284-0040<br>
          La Parmesana - Sabor y calidad que distingue
        </p>
      </div>
    </body>
    </html>
  `);
});

app.get('/payment/failure', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pago No Procesado - La Parmesana</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .error-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        h1 { color: #e74c3c; }
        .btn {
          background: #3498db;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="error-icon">❌</div>
        <h1>Pago No Procesado</h1>
        <p>Hubo un problema con el pago.</p>
        <p>Tu pedido NO ha sido confirmado.</p>
        <br>
        <p><strong>¿Qué puedes hacer?</strong></p>
        <ul style="text-align: left; display: inline-block;">
          <li>Intentar con otra tarjeta</li>
          <li>Verificar fondos disponibles</li>
          <li>Contactarnos para pagar en efectivo</li>
        </ul>
        <br><br>
        <p style="color: #666; font-size: 14px;">
          📞 828-284-0040<br>
          Contáctanos por WhatsApp para ayudarte
        </p>
      </div>
    </body>
    </html>
  `);
});

app.get('/payment/pending', async (req, res) => {
  const { external_reference } = req.query;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pago Pendiente - La Parmesana</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .pending-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        h1 { color: #f39c12; }
        .order-id {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="pending-icon">⏳</div>
        <h1>Pago Pendiente</h1>
        <div class="order-id">
          Pedido #${external_reference}
        </div>
        <p>Tu pago está siendo procesado.</p>
        <p>Si pagaste con transferencia u OXXO, puede tardar algunos minutos.</p>
        <br>
        <p>Te notificaremos por WhatsApp cuando se confirme el pago.</p>
        <br>
        <p style="color: #666; font-size: 14px;">
          📞 828-284-0040<br>
          La Parmesana
        </p>
      </div>
    </body>
    </html>
  `);
});

// Dashboard simple de estadísticas
app.get('/dashboard', async (req, res) => {
  try {
    const stats = await orderManager.getStats();
    
    res.json({
      service: 'La Parmesana Bot',
      stats: {
        totalOrders: stats.total,
        todayOrders: stats.today,
        pendingOrders: stats.pending,
        completedOrders: stats.completed
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error general:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  const twilioStatus = twilioClient ? '✅ ACTIVO' : '⚠️  NO CONFIGURADO';
  const mpStatus = process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ ACTIVO' : '⚠️  NO CONFIGURADO';
  
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║  🍕 LA PARMESANA WHATSAPP BOT 🤖         ║
  ╠═══════════════════════════════════════════╣
  ║  Servidor: http://localhost:${PORT}          ║
  ║  Estado: ✅ ACTIVO                        ║
  ║  IA: Claude Sonnet 4                     ║
  ║  WhatsApp: ${twilioStatus}                       ║
  ║  Pagos: ${mpStatus}                          ║
  ╠═══════════════════════════════════════════╣
  ${!twilioClient ? '║  ⚠️  Para WhatsApp: configurar Twilio    ║\n' : ''}${!process.env.MERCADOPAGO_ACCESS_TOKEN ? '║  ⚠️  Para pagos: configurar Mercado Pago ║\n' : ''}╚═══════════════════════════════════════════╝
  `);
  
  if (!twilioClient && !process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.log('💡 TIP: Puedes usar el simulador con "node test-chat.js"\n');
  }
});

module.exports = app;
