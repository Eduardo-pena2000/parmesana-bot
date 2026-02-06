const mercadopago = require('mercadopago');

class MercadoPagoIntegration {
  constructor(accessToken) {
    this.client = new mercadopago.MercadoPagoConfig({
      accessToken: accessToken
    });
    this.preference = new mercadopago.Preference(this.client);
    this.payment = new mercadopago.Payment(this.client);
  }

  /**
   * Genera un link de pago para un pedido
   * @param {Object} order - Datos del pedido
   * @returns {Promise<Object>} - URL de pago y ID de preferencia
   */
  async generarLinkPago(order) {
    try {
      const preferenceData = {
        items: order.items.map(item => ({
          id: item.id || String(Math.random()),
          title: item.name,
          description: item.description || item.name,
          quantity: item.quantity || 1,
          unit_price: Number(item.price),
          currency_id: 'MXN'
        })),
        
        payer: {
          name: order.customerName || 'Cliente',
          phone: {
            number: order.phoneNumber
          }
        },

        back_urls: {
          success: `${process.env.BASE_URL}/payment/success`,
          failure: `${process.env.BASE_URL}/payment/failure`,
          pending: `${process.env.BASE_URL}/payment/pending`
        },

        notification_url: `${process.env.BASE_URL}/webhooks/mercadopago`,

        external_reference: order.id,

        metadata: {
          order_id: order.id,
          customer_phone: order.phoneNumber,
          delivery_address: order.deliveryAddress || 'Para llevar'
        },

        statement_descriptor: 'LA PARMESANA',

        // Métodos de pago disponibles
        payment_methods: {
          excluded_payment_types: [],
          installments: 1 // Sin meses sin intereses por defecto
        },

        // Expiración del link (24 horas)
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),

        // Auto return
        auto_return: 'approved'
      };

      const response = await this.preference.create({ body: preferenceData });

      console.log(`✅ Link de pago generado para pedido ${order.id}`);

      return {
        success: true,
        paymentLink: response.init_point,
        sandboxLink: response.sandbox_init_point,
        preferenceId: response.id,
        orderId: order.id
      };

    } catch (error) {
      console.error('❌ Error generando link de Mercado Pago:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verifica el estado de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async verificarPago(paymentId) {
    try {
      const payment = await this.payment.get({ id: paymentId });

      return {
        success: true,
        status: payment.status,
        statusDetail: payment.status_detail,
        amount: payment.transaction_amount,
        orderId: payment.external_reference,
        paymentMethod: payment.payment_method_id,
        approved: payment.status === 'approved'
      };

    } catch (error) {
      console.error('❌ Error verificando pago:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Procesa notificación de webhook
   * @param {Object} notification - Datos de la notificación
   * @returns {Promise<Object>} - Información del pago
   */
  async procesarWebhook(notification) {
    try {
      console.log('📩 Webhook recibido:', notification.type);

      // Solo procesar notificaciones de pago
      if (notification.type !== 'payment') {
        return { success: false, message: 'Tipo de notificación no soportado' };
      }

      const paymentId = notification.data.id;
      const paymentInfo = await this.verificarPago(paymentId);

      if (paymentInfo.approved) {
        console.log(`✅ Pago aprobado para pedido ${paymentInfo.orderId}`);
      } else {
        console.log(`⏳ Pago pendiente/rechazado: ${paymentInfo.status}`);
      }

      return paymentInfo;

    } catch (error) {
      console.error('❌ Error procesando webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Genera mensaje de WhatsApp con link de pago
   * @param {Object} order - Datos del pedido
   * @param {string} paymentLink - Link de pago
   * @returns {string} - Mensaje formateado
   */
  generarMensajePago(order, paymentLink) {
    const itemsList = order.items
      .map(item => `  • ${item.name} ${item.quantity > 1 ? `x${item.quantity}` : ''} - $${item.price * item.quantity}`)
      .join('\n');

    return `🎉 ¡Pedido confirmado!

📋 *Pedido #${order.id}*

${itemsList}

💰 *Total: $${order.total} MXN*

📍 ${order.deliveryAddress || 'Para recoger en restaurante'}

━━━━━━━━━━━━━━━━━━

💳 *PAGA AHORA DE FORMA SEGURA:*

👉 ${paymentLink}

✅ Aceptamos:
• Tarjetas de crédito y débito
• Transferencia bancaria
• Mercado Pago

⏰ *Link válido por 24 horas*

Una vez confirmado tu pago, comenzaremos a preparar tu pedido inmediatamente.

Tiempo estimado: 30-45 minutos

¿Prefieres pagar en efectivo? Responde "efectivo" y confirmaremos tu pedido.

━━━━━━━━━━━━━━━━━━
La Parmesana 🍕
"Sabor y calidad que distingue"`;
  }

  /**
   * Genera mensaje de pago exitoso
   * @param {Object} order - Datos del pedido
   * @returns {string} - Mensaje de confirmación
   */
  generarMensajePagoExitoso(order) {
    return `✅ *¡PAGO CONFIRMADO!*

Gracias por tu pago. Tu pedido #${order.id} está siendo preparado.

⏰ Tiempo estimado: 30-45 minutos

📍 ${order.deliveryAddress || 'Para recoger en restaurante'}

Te notificaremos cuando esté listo para entregar/recoger.

━━━━━━━━━━━━━━━━━━
La Parmesana 🍕
📞 828-284-0040`;
  }

  /**
   * Genera mensaje de pago pendiente
   * @param {Object} order - Datos del pedido
   * @returns {string} - Mensaje de espera
   */
  generarMensajePagoPendiente(order) {
    return `⏳ *Pago pendiente*

Tu pedido #${order.id} está esperando confirmación de pago.

Si pagaste con transferencia u OXXO, puede tardar unos minutos en confirmarse.

Te notificaremos en cuanto se confirme el pago.

━━━━━━━━━━━━━━━━━━
La Parmesana 🍕`;
  }

  /**
   * Genera mensaje de pago rechazado
   * @param {Object} order - Datos del pedido
   * @returns {string} - Mensaje de error
   */
  generarMensajePagoRechazado(order) {
    return `❌ *Pago no procesado*

Hubo un problema con el pago de tu pedido #${order.id}.

Posibles causas:
• Fondos insuficientes
• Tarjeta rechazada
• Sesión expirada

¿Qué deseas hacer?
1️⃣ Intentar pagar nuevamente
2️⃣ Usar otro método de pago
3️⃣ Pagar en efectivo al recibir

Responde con el número de tu opción.

━━━━━━━━━━━━━━━━━━
La Parmesana 🍕
📞 828-284-0040`;
  }
}

module.exports = MercadoPagoIntegration;
