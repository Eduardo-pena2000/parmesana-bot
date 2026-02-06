# 🍕 La Parmesana - WhatsApp Chatbot con IA

Chatbot inteligente para WhatsApp con Claude AI que gestiona pedidos, responde preguntas sobre el menú y ofrece una experiencia conversacional natural para el restaurante La Parmesana.

## 🚀 Características

- ✅ **IA Conversacional Avanzada**: Powered by Claude Sonnet 4
- 📱 **Integración WhatsApp**: Vía Twilio API
- 🛒 **Gestión de Pedidos**: Sistema completo de órdenes
- 📊 **Dashboard de Estadísticas**: Monitoreo en tiempo real
- 💬 **Memoria Conversacional**: Mantiene contexto de conversaciones
- 🎯 **Recomendaciones Inteligentes**: Sugerencias personalizadas
- 💰 **Cálculo Automático**: Precios, extras y totales

## 📋 Requisitos Previos

- Node.js v16 o superior
- Cuenta de Twilio (para WhatsApp Business API)
- API Key de Anthropic (Claude)
- PostgreSQL (opcional, para producción)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

\`\`\`bash
cd parmesana-bot
npm install
\`\`\`

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edita con tus credenciales:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita `.env`:

\`\`\`env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Server
PORT=3000
\`\`\`

### 3. Obtener credenciales de Twilio

1. Crear cuenta en [Twilio](https://www.twilio.com/try-twilio)
2. Ir a Console → Messaging → WhatsApp sandbox
3. Copiar el número de WhatsApp sandbox
4. Copiar Account SID y Auth Token
5. Configurar webhook: `https://tu-servidor.com/whatsapp`

### 4. Obtener API Key de Claude

1. Ir a [console.anthropic.com](https://console.anthropic.com/)
2. Crear una API Key
3. Copiar al archivo `.env`

### 5. Iniciar el servidor

\`\`\`bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
\`\`\`

## 🌐 Despliegue en Producción

### Opción 1: Railway / Render / Heroku

\`\`\`bash
# Ejemplo con Railway
railway login
railway init
railway up
railway open
\`\`\`

### Opción 2: VPS (DigitalOcean, AWS, etc.)

\`\`\`bash
# En tu servidor
git clone tu-repositorio
cd parmesana-bot
npm install --production
pm2 start src/server.js --name parmesana-bot
pm2 save
pm2 startup
\`\`\`

### Opción 3: Ngrok (para testing local)

\`\`\`bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000
# Copiar URL https://xxxxx.ngrok.io y configurar en Twilio webhook
\`\`\`

## 📱 Configurar Webhook en Twilio

1. Ir a Twilio Console
2. Messaging → Try it out → Send a WhatsApp message
3. Sandbox settings
4. WHEN A MESSAGE COMES IN: `https://tu-dominio.com/whatsapp`
5. Método: POST
6. Guardar

## 💬 Uso del Chatbot

### Ejemplo de conversación:

**Cliente:** "Hola"

**Bot:** "¡Hola! 😊 Bienvenido a La Parmesana. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?

Puedo mostrarte nuestro menú, tomar tu pedido, responder preguntas o ayudarte con promociones especiales. ¿Qué te gustaría hacer?"

**Cliente:** "Quiero una pizza parmesana"

**Bot:** "¡Excelente elección! 🍕 La Pizza Parmesana es nuestra especialidad con 10 ingredientes deliciosos.

¿Qué tamaño prefieres?
- Individual: $100
- Mediana: $215
- Grande: $270
- Familiar: $325"

**Cliente:** "Grande"

**Bot:** "Perfecto. Pizza Parmesana Grande ($270) ✅

¿Deseas agregar algo más?
- Extra queso (+$55)
- Orilla de queso muncher (+$65)
- Alguna bebida o entrada"

## 🔧 API Endpoints

### Mensajes

- `POST /whatsapp` - Webhook principal (Twilio)
- `POST /whatsapp/send-message` - Enviar mensaje proactivo

### Pedidos

- `POST /whatsapp/confirm-order` - Confirmar pedido
- `POST /whatsapp/cancel-order` - Cancelar pedido
- `GET /whatsapp/order-summary/:phoneNumber` - Resumen de pedido

### Utilidades

- `GET /` - Health check
- `GET /dashboard` - Estadísticas
- `POST /whatsapp/clear/:phoneNumber` - Limpiar conversación

## 📊 Monitoreo y Logs

\`\`\`bash
# Ver logs en tiempo real
pm2 logs parmesana-bot

# Ver estadísticas
curl http://localhost:3000/dashboard
\`\`\`

## 💰 Costos Estimados

**Para 1,000 conversaciones mensuales:**

- WhatsApp (Twilio): ~$8-15
- Claude API: ~$6
- Hosting: $5-20
- **Total: $19-41/mes**

## 🎨 Personalización

### Modificar el menú:

Edita `src/data/menu.json`

### Cambiar personalidad del bot:

Edita el método `getSystemPrompt()` en `src/ai/assistant.js`

### Agregar nuevas funciones:

Agrega endpoints en `src/server.js`

## 🐛 Troubleshooting

**Problema:** Bot no responde

- Verifica que el webhook esté configurado correctamente
- Revisa logs: `pm2 logs` o `npm run dev`
- Confirma que las API keys sean válidas

**Problema:** Errores de Claude API

- Verifica que tengas créditos en tu cuenta de Anthropic
- Confirma que la API key sea correcta
- Revisa límites de rate: https://console.anthropic.com/

**Problema:** Errores de Twilio

- Verifica que el número de sandbox esté activado
- Confirma que el webhook use HTTPS (no HTTP)
- Revisa logs en Twilio Console → Monitor → Logs

## 📞 Soporte

- Documentación Twilio: https://www.twilio.com/docs/whatsapp
- Documentación Claude: https://docs.anthropic.com/
- Issues: [GitHub Issues]

## 📝 Licencia

MIT License - La Parmesana

## 🙏 Créditos

Desarrollado para **La Parmesana** - Cadereyta, NL
- IA: Claude by Anthropic
- WhatsApp: Twilio API
- Stack: Node.js, Express

---

**¡Tu chatbot está listo! 🎉**

Para activarlo:
1. Configura las credenciales en `.env`
2. Ejecuta `npm install && npm start`
3. Configura el webhook en Twilio
4. ¡Listo para recibir pedidos por WhatsApp!
