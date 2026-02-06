# 🚀 Guía de Inicio Rápido - La Parmesana WhatsApp Bot

## ✅ Lo que tienes

Un chatbot completamente funcional con:
- ✨ Inteligencia Artificial conversacional (Claude Sonnet 4)
- 📱 Integración con WhatsApp (vía Twilio)
- 🍕 Todo el menú de La Parmesana programado
- 🛒 Sistema de gestión de pedidos
- 📊 Dashboard de estadísticas
- 💰 Optimizado para costos bajos

## 📦 Contenido del Proyecto

```
parmesana-bot/
├── src/
│   ├── ai/
│   │   └── assistant.js         # Motor de IA con Claude
│   ├── data/
│   │   └── menu.json            # Menú completo de La Parmesana
│   ├── orders/
│   │   └── manager.js           # Gestión de pedidos
│   └── server.js                # Servidor principal
├── test-chat.js                 # Prueba el bot sin WhatsApp
├── package.json                 # Dependencias
├── .env.example                 # Configuración (copiar a .env)
├── README.md                    # Documentación completa
├── COSTOS.md                    # Análisis de costos
└── FLUJOS.md                    # Flujos conversacionales
```

## ⚡ Pasos para Activar (10 minutos)

### 1️⃣ Instalar Node.js (si no lo tienes)
```bash
# Ir a https://nodejs.org/
# Descargar e instalar la versión LTS
```

### 2️⃣ Preparar el Proyecto
```bash
# Descomprimir el archivo
# Abrir terminal en la carpeta

# Instalar dependencias
npm install
```

### 3️⃣ Obtener Credenciales

**A) Twilio (WhatsApp):**
1. Ir a https://www.twilio.com/try-twilio
2. Crear cuenta gratuita
3. Ir a Console → Messaging → Try WhatsApp
4. Guardar:
   - Account SID
   - Auth Token
   - WhatsApp Number

**B) Claude API:**
1. Ir a https://console.anthropic.com/
2. Crear cuenta
3. Generate API Key
4. Guardar la key

### 4️⃣ Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales:
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ANTHROPIC_API_KEY=sk-ant-tu_api_key
PORT=3000
```

### 5️⃣ Probar Localmente (SIN necesidad de servidor)
```bash
# Iniciar el simulador de chat
node test-chat.js

# Conversa con el bot en la terminal para probarlo
```

### 6️⃣ Conectar con WhatsApp (Producción)

**Opción A: Testing Local (Ngrok)**
```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Exponer con ngrok
npx ngrok http 3000

# Copiar URL https (ej: https://abc123.ngrok.io)
# Ir a Twilio Console → WhatsApp Sandbox
# Pegar: https://abc123.ngrok.io/whatsapp
# Guardar
```

**Opción B: Despliegue en Nube (Railway - Gratis)**
```bash
# 1. Crear cuenta en railway.app
# 2. Conectar con GitHub
# 3. Subir el proyecto
# 4. Railway te da URL automática
# 5. Configurar webhook en Twilio con esa URL
```

### 7️⃣ Activar en WhatsApp
```bash
# Escanear QR en Twilio Sandbox
# O enviar código de activación al número
# ¡Listo! Ya puedes chatear con el bot
```

## 💬 Probarlo

Envía por WhatsApp:
```
Hola
```

El bot responderá:
```
¡Hola! 😊 Bienvenido a La Parmesana...
```

## 🎯 Casos de Uso

**1. Cliente pide una pizza:**
```
Cliente: "Quiero una pizza parmesana grande"
Bot: "¡Excelente elección! 🍕 
Pizza Parmesana Grande: $270
¿Deseas agregar extra queso ($55) u orilla muncher ($65)?"
```

**2. Cliente consulta el menú:**
```
Cliente: "¿Qué tienen de hamburguesas?"
Bot: [Muestra todas las hamburguesas con precios]
```

**3. Cliente hace pedido completo:**
```
Cliente: "Pizza parmesana mediana, 6 alitas BBQ y 2 cocas"
Bot: [Toma el pedido, calcula total, pide dirección, confirma]
```

## 📊 Monitorear

```bash
# Ver estadísticas
curl http://localhost:3000/dashboard

# Ver logs en tiempo real
npm run dev
# (muestra cada mensaje que llega y sale)
```

## 💰 Costos Reales

Para 500 conversaciones/mes:
- WhatsApp: ~$8
- Claude API: ~$3
- Hosting: $5-10
- **TOTAL: $16-21/mes**

**ROI:** Se paga solo en 1-2 días de operación.

## 🆘 Solución de Problemas

**Problema: "Cannot find module"**
```bash
npm install
```

**Problema: "API key invalid"**
- Verifica que copiaste correctamente la API key
- Verifica que no tenga espacios extras
- Regenera la key si es necesario

**Problema: "Bot no responde en WhatsApp"**
- Verifica webhook en Twilio
- Debe ser HTTPS (no HTTP)
- Verifica que el servidor esté corriendo
- Revisa logs del servidor

**Problema: "Insufficient credits"**
- Agrega créditos en console.anthropic.com
- O en Twilio Console

## 📚 Documentación Completa

- `README.md` - Guía completa de instalación
- `COSTOS.md` - Análisis detallado de costos y ROI
- `FLUJOS.md` - Todos los flujos conversacionales
- Código comentado en todos los archivos

## 🎉 ¡Siguiente Nivel!

Una vez funcionando, puedes:
1. Personalizar respuestas del bot (editar `assistant.js`)
2. Agregar nuevos platillos (editar `menu.json`)
3. Implementar base de datos PostgreSQL
4. Agregar notificaciones al personal
5. Integrar con sistema de pagos
6. Agregar analytics avanzados

## 📞 Soporte

Si tienes dudas:
1. Revisa la documentación completa
2. Busca en el código (está bien comentado)
3. Consulta docs de Twilio: https://www.twilio.com/docs
4. Consulta docs de Claude: https://docs.anthropic.com

---

## ✨ Bonus: Comandos Útiles

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start

# Probar sin WhatsApp
node test-chat.js

# Ver estadísticas
curl localhost:3000/dashboard

# Limpiar conversación de un cliente
curl -X POST localhost:3000/whatsapp/clear/+5215551234567
```

---

**🍕 ¡Tu chatbot está listo para tomar pedidos! 🚀**

**Tiempo estimado de setup: 10-15 minutos**
**Dificultad: Fácil (si sigues los pasos)**
**Costo mensual: $16-40**
**ROI: 1-2 días** ⚡
