# 💳 Integración con Mercado Pago - Guía Completa

## 🎉 ¡Ya está lista la integración!

Tu bot ahora puede:
- ✅ Generar links de pago automáticamente
- ✅ Aceptar tarjetas de crédito/débito
- ✅ Aceptar transferencias bancarias
- ✅ Aceptar pagos en OXXO
- ✅ Confirmar pedidos automáticamente al recibir el pago
- ✅ Notificar al cliente por WhatsApp

---

## 🚀 Configuración (15 minutos)

### **Paso 1: Crear Cuenta en Mercado Pago**

1. Ir a: https://www.mercadopago.com.mx/developers
2. **Crear cuenta** o iniciar sesión
3. Es **GRATIS** - no tiene costo mensual

---

### **Paso 2: Obtener Credenciales**

1. En el panel de desarrolladores, ir a **"Tus integraciones"**
2. Crear una nueva aplicación:
   - Nombre: "La Parmesana Bot"
   - Producto: Checkout Pro
   - Modelo de integración: Online
3. Una vez creada, ir a **"Credenciales"**
4. **IMPORTANTE:** Verás dos tipos de credenciales:

#### **🧪 Credenciales de Prueba (Testing)**
```
Public Key de prueba: TEST-xxxxx
Access Token de prueba: TEST-xxxxx
```
Úsalas primero para probar sin riesgo.

#### **🔴 Credenciales de Producción (Real)**
```
Public Key de producción: APP_USR-xxxxx
Access Token de producción: APP_USR-xxxxx
```
Úsalas cuando todo funcione bien.

---

### **Paso 3: Configurar en tu Bot**

1. **Abrir tu archivo `.env`**:
   ```bash
   notepad .env
   ```

2. **Agregar tus credenciales:**
   ```env
   # Mercado Pago
   MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx-tu-access-token-aqui
   BASE_URL=https://tu-dominio.com
   ```

3. **Para pruebas locales con ngrok:**
   ```env
   BASE_URL=https://tu-subdominio.ngrok.io
   ```

4. **Guardar** el archivo

---

### **Paso 4: Instalar Dependencia**

```bash
npm install
```

Esto instalará automáticamente el SDK de Mercado Pago.

---

### **Paso 5: Configurar Webhooks en Mercado Pago**

Los webhooks son CRÍTICOS para recibir notificaciones de pago.

1. En tu panel de Mercado Pago, ir a **"Webhooks"**
2. Click en **"Crear webhook"**
3. Configurar:
   ```
   URL de notificación: https://tu-dominio.com/webhooks/mercadopago
   Eventos: payment (seleccionar)
   ```
4. **Guardar**

⚠️ **IMPORTANTE:** La URL debe ser HTTPS (no HTTP)

---

### **Paso 6: Iniciar el Bot**

```bash
npm start
```

---

## 🧪 Probar la Integración

### **1. Probar con Tarjetas de Prueba**

Mercado Pago tiene tarjetas de prueba que puedes usar:

**Tarjeta Aprobada:**
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: APRO
```

**Tarjeta Rechazada:**
```
Número: 5031 4332 1540 6351
CVV: 123
Fecha: 11/25
Nombre: OTHE
```

### **2. Hacer un Pedido de Prueba**

1. **Envía por WhatsApp:**
   ```
   Hola, quiero una pizza parmesana grande
   ```

2. **El bot responderá con el menú**

3. **Confirma el pedido:**
   ```
   Finalizar pedido
   ```

4. **Elige "Pagar con tarjeta"**

5. **El bot enviará un link de pago**

6. **Click en el link y paga con la tarjeta de prueba**

7. **Deberías recibir:**
   - Confirmación en pantalla
   - Mensaje de WhatsApp confirmando
   - El pedido marcado como pagado

---

## 🔄 Cómo Funciona el Flujo

```
1. Cliente hace pedido
        ↓
2. Bot calcula total
        ↓
3. Cliente elige "Pagar con tarjeta"
        ↓
4. Bot genera link de pago (Mercado Pago)
        ↓
5. Bot envía link por WhatsApp
        ↓
6. Cliente abre link y paga
        ↓
7. Mercado Pago procesa pago
        ↓
8. Mercado Pago notifica a tu servidor (webhook)
        ↓
9. Bot confirma pedido automáticamente
        ↓
10. Bot notifica al cliente: "¡Pago confirmado!"
        ↓
11. Bot notifica al restaurante (consola/email/SMS)
        ↓
12. Restaurante prepara comida
```

---

## 💰 Comisiones de Mercado Pago

**Cobros de Mercado Pago:**
- Tarjetas de crédito: 3.99% + $4 MXN
- Tarjetas de débito: 2.99% + $4 MXN
- Transferencia: 0.99%
- OXXO: $12 MXN por pago

**Ejemplo:**
- Pedido de $300
- Comisión: ~$16 (5.3%)
- **Recibes: $284**

---

## 🎯 Ventajas vs Pagar en Efectivo

### **Pago Online:**
- ✅ **Cero pedidos falsos** (pagaron primero)
- ✅ Dinero garantizado antes de cocinar
- ✅ No manejar efectivo
- ✅ Más rápido (no cobrar al entregar)
- ✅ Todo rastreado automáticamente
- ✅ Disponible 24/7

### **Pago en Efectivo:**
- ❌ Riesgo de pedidos falsos (~10-15%)
- ❌ Repartidor maneja efectivo
- ❌ Riesgo de robo
- ❌ Tiempo perdido cobrando

**Conclusión:** Aunque Mercado Pago cobra comisión, **recuperas más** evitando pedidos falsos y siendo más eficiente.

---

## 📱 Mensajes que Verá el Cliente

### **1. Después de Hacer el Pedido:**
```
🎉 ¡Pedido confirmado!

📋 Pedido #PARM-1234

  • Pizza Parmesana Grande - $270
  • Coca Cola x2 - $70

💰 Total: $340 MXN

📍 Calle Example 123

━━━━━━━━━━━━━━━━━━

💳 PAGA AHORA DE FORMA SEGURA:

👉 https://mpago.li/xxxxxx

✅ Aceptamos:
• Tarjetas de crédito y débito
• Transferencia bancaria
• Mercado Pago

⏰ Link válido por 24 horas

Una vez confirmado tu pago, comenzaremos 
a preparar tu pedido inmediatamente.

Tiempo estimado: 30-45 minutos

¿Prefieres pagar en efectivo? 
Responde "efectivo" y confirmaremos tu pedido.
```

### **2. Después de Pagar:**
```
✅ ¡PAGO CONFIRMADO!

Gracias por tu pago. Tu pedido #PARM-1234 
está siendo preparado.

⏰ Tiempo estimado: 30-45 minutos

📍 Calle Example 123

Te notificaremos cuando esté listo para entregar.

━━━━━━━━━━━━━━━━━━
La Parmesana 🍕
📞 828-284-0040
```

---

## 🔧 Personalización Avanzada

### **Cambiar Tiempo de Preparación:**

Edita `src/payments/mercadopago.js`, línea con:
```javascript
Tiempo estimado: 30-45 minutos
```

### **Agregar Meses Sin Intereses:**

En `mercadopago.js`, busca:
```javascript
installments: 1
```

Cambia a:
```javascript
installments: 3  // 3 meses sin intereses
```

### **Personalizar Mensajes:**

Edita las funciones en `mercadopago.js`:
- `generarMensajePago()`
- `generarMensajePagoExitoso()`
- `generarMensajePagoPendiente()`

---

## 🆘 Solución de Problemas

### **Problema: "Webhook no recibe notificaciones"**

**Solución:**
1. Verifica que BASE_URL sea HTTPS
2. Verifica que el servidor esté corriendo
3. Verifica en Mercado Pago → Webhooks → Ver logs
4. Prueba manualmente: `curl -X POST https://tu-url.com/webhooks/mercadopago`

### **Problema: "Link de pago no funciona"**

**Solución:**
1. Verifica que `MERCADOPAGO_ACCESS_TOKEN` sea correcto
2. Verifica que tengas credenciales de producción (no de prueba)
3. Verifica que la cuenta esté verificada

### **Problema: "Pago aprobado pero pedido no se confirma"**

**Solución:**
1. Revisa logs del servidor
2. Verifica que el webhook esté configurado
3. Verifica que BASE_URL sea correcta

---

## 📊 Dashboard de Pagos

Para ver todos los pagos recibidos:

1. Panel de Mercado Pago → **"Ventas"**
2. Verás todos los pagos con:
   - Monto
   - Estado
   - Método de pago
   - Fecha
   - Pedido asociado (external_reference)

---

## 🎓 Próximos Pasos

Una vez que todo funcione:

1. **Cambiar a credenciales de producción**
2. **Activar cuenta de Mercado Pago** (verificar identidad)
3. **Configurar datos fiscales** (para recibir pagos)
4. **¡Empezar a recibir pagos reales!** 💰

---

## 💡 Tips Pro

1. **Ofrece ambas opciones:** Online Y efectivo
2. **Da descuento** por pagar online (5%)
3. **Promueve el pago online** en tus redes
4. **Monitorea conversión:** ¿Cuántos pagan online vs efectivo?
5. **Haz seguimiento** a carritos abandonados

---

## 📞 Soporte

**Mercado Pago:**
- Docs: https://www.mercadopago.com.mx/developers
- Soporte: https://www.mercadopago.com.mx/ayuda

**El Bot:**
- Revisa logs con: `npm run dev`
- Consola muestra cada paso

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Mercado Pago creada
- [ ] Credenciales obtenidas (Access Token)
- [ ] `.env` configurado con credenciales
- [ ] `npm install` ejecutado
- [ ] Webhook configurado en Mercado Pago
- [ ] BASE_URL configurada (HTTPS)
- [ ] Servidor corriendo (`npm start`)
- [ ] Probado con tarjeta de prueba
- [ ] Pago confirmado exitosamente
- [ ] Notificaciones de WhatsApp funcionando

---

**¡Tu bot ahora acepta pagos online! 🎉💳**

**Tiempo de setup: 15-20 minutos**
**Costo adicional mensual: $0** (solo comisiones por transacción)
