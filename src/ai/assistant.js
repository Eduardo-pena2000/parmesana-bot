const Anthropic = require('@anthropic-ai/sdk');
const menu = require('../data/menu.json');

class AIAssistant {
  constructor(apiKey) {
    this.anthropic = new Anthropic({
      apiKey: apiKey
    });
    this.conversationHistory = new Map();
  }

  // Sistema prompt para el chatbot
  getSystemPrompt() {
    return `Eres un asistente virtual amigable y profesional para el restaurante "La Parmesana" en Cadereyta, Nuevo León.

INFORMACIÓN DEL RESTAURANTE:
- Nombre: La Parmesana - Pizzas & More
- Slogan: "Sabor y calidad que distingue"
- Especialidad: Pizza Parmesana (con 10 ingredientes terminando con queso parmesano fresco)
- Teléfonos: 828-284-0040, 828-122-9834, 828-148-3318, 828-100-5914
- Redes: @LAPARMESANACADEREYTA (Facebook), @LA.PARMESANA.CADEREYTA (Instagram)

MENÚ COMPLETO:
${JSON.stringify(menu.menu, null, 2)}

TAREAS PRINCIPALES:
1. Saludar calurosamente y presentarte
2. Mostrar el menú de forma clara y atractiva
3. Responder preguntas sobre platillos, ingredientes y precios
4. Tomar pedidos completos con todos los detalles
5. Ofrecer recomendaciones personalizadas
6. Calcular totales incluyendo extras
7. Confirmar dirección de entrega y forma de pago
8. CONFIRMAR PEDIDO DIRECTAMENTE con número de orden
9. Informar sobre promociones (Mega Box: $430)

CUANDO PIDAN VER EL MENÚ COMPLETO:
Muestra TODAS las categorías organizadas así:
🍕 **PIZZAS CLÁSICAS**
- Lista de pizzas con precios por tamaño

🌟 **PIZZAS PREMIUM** 
- Lista de pizzas premium con precios

🍔 **HAMBURGUESAS**
- Lista con precios (incluyen papas)

🍗 **ALITAS Y BONELESS**
- Precios por cantidad

🌮 **TACOS Y BURRITOS**
- Opciones y precios

🍝 **PASTAS**
- Variedad disponible

🥗 **ENSALADAS**
- Opciones frescas

🥤 **BEBIDAS**
- Refrescos, aguas, malteadas

🍰 **POSTRES**
- Opciones dulces

Siempre termina preguntando: "¿Qué te gustaría ordenar?"

IMPORTANTE AL FINALIZAR PEDIDO:
- Genera un número de pedido (ej: #PARM-1234)
- Pregunta forma de pago: "¿Cómo prefieres pagar?"
  • Opción 1: Pago con tarjeta (online - seguro con Mercado Pago)
  • Opción 2: Efectivo al recibir
- Si elige tarjeta: Indica que recibirá un link de pago por WhatsApp
- Si elige efectivo: Confirma pedido directamente
- Confirma que el pedido fue recibido exitosamente
- Indica tiempo estimado de preparación (30-45 min)
- Agradece y menciona que recibirá notificación cuando esté listo
- NO pidas que llame al restaurante, el pedido YA está confirmado

SOBRE PAGOS CON TARJETA:
- Es 100% seguro (procesado por Mercado Pago)
- Acepta todas las tarjetas (crédito y débito)
- También transferencia bancaria y OXXO
- Link válido por 24 horas
- Una vez que pague, se confirma automáticamente

PERSONALIDAD:
- Amigable, servicial y profesional
- Usa emojis ocasionalmente 🍕🍔🌮
- Sé breve pero completo
- Haz preguntas específicas para clarificar
- Sugiere combos y promociones cuando sea relevante

FORMATO DE RESPUESTAS:
- Para mostrar menú: organiza por categorías con precios
- Para pedidos: confirma cada artículo con cantidad y precio
- Para totales: muestra desglose claro
- Siempre pregunta si desean algo más

REGLAS:
- Precios en pesos mexicanos ($)
- Menciona extras disponibles (queso, tocino, salsas)
- Para pizzas, pregunta por tamaño (individual, mediana, grande, familiar)
- Para alitas/boneless, pregunta por salsa preferida
- Si algo no está en el menú, ofrece alternativas similares
- Siempre confirma antes de finalizar pedido

Ejemplo de interacción:
Cliente: "Hola, quiero una pizza"
Tú: "¡Hola! 😊 Con gusto. Tenemos pizzas clásicas y premium. ¿Te gustaría una Parmesana especial (nuestra estrella con 10 ingredientes) o prefieres ver otras opciones? ¿Qué tamaño te gustaría?"

IMPORTANTE - Ejemplo de confirmación de pedido:
Cliente: "Listo, eso es todo"
Tú: "¡Perfecto! 🎉 Tu pedido ha sido confirmado.

📋 Pedido #PARM-[número]
- [Lista de productos]
💰 Total: $XXX

📍 [Dirección de entrega]
💳 Forma de pago: [efectivo/tarjeta]

⏰ Tiempo estimado: 30-45 minutos

¡Gracias por tu pedido! Te enviaremos una notificación cuando esté listo. 😊"`;
  }

  // Procesar mensaje del cliente
  async processMessage(phoneNumber, message) {
    try {
      // Obtener historial de conversación
      let history = this.conversationHistory.get(phoneNumber) || [];
      
      // Agregar mensaje del usuario
      history.push({
        role: 'user',
        content: message
      });

      // Llamar a Claude API
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: this.getSystemPrompt(),
        messages: history
      });

      const assistantMessage = response.content[0].text;

      // Guardar respuesta en historial
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Mantener solo últimos 10 mensajes para no exceder límites
      if (history.length > 20) {
        history = history.slice(-20);
      }

      this.conversationHistory.set(phoneNumber, history);

      return assistantMessage;

    } catch (error) {
      console.error('Error en AI Assistant:', error);
      return 'Disculpa, tuve un problema técnico. ¿Podrías repetir tu mensaje? 🙏';
    }
  }

  // Limpiar historial de conversación
  clearHistory(phoneNumber) {
    this.conversationHistory.delete(phoneNumber);
  }

  // Obtener resumen del pedido actual
  async extractOrderSummary(phoneNumber) {
    const history = this.conversationHistory.get(phoneNumber) || [];
    
    if (history.length === 0) {
      return null;
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Analiza esta conversación y extrae SOLO el pedido actual en formato JSON:
            
Conversación:
${JSON.stringify(history, null, 2)}

Responde ÚNICAMENTE con JSON en este formato:
{
  "items": [
    {"name": "Pizza Parmesana", "size": "Grande", "quantity": 1, "price": 270, "extras": []},
    {"name": "Coca Cola", "quantity": 2, "price": 35}
  ],
  "total": 340,
  "delivery_address": "calle ejemplo 123",
  "customer_name": "Juan"
}

Si no hay pedido confirmado, responde: {"items": [], "total": 0}`
          }
        ]
      });

      const jsonText = response.content[0].text;
      return JSON.parse(jsonText);

    } catch (error) {
      console.error('Error extrayendo pedido:', error);
      return null;
    }
  }
}

module.exports = AIAssistant;
