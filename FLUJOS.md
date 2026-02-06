# 🔄 Flujos Conversacionales - La Parmesana Bot

## 📱 Flujo Principal: Hacer un Pedido

```
┌─────────────────────────────────────────────────────────────┐
│                     INICIO DE CONVERSACIÓN                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────┐
        │  Cliente envía "Hola" por WhatsApp   │
        └──────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────┐
        │  Bot: Saludo + Opciones principales  │
        │  - Ver menú                          │
        │  - Hacer pedido                      │
        │  - Preguntas sobre platillos         │
        │  - Promociones                       │
        └──────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    ┌──────────────────┐       ┌──────────────────┐
    │  FLUJO CONSULTA  │       │   FLUJO PEDIDO   │
    └──────────────────┘       └──────────────────┘
              │                           │
              │                           ▼
              │              ┌──────────────────────────┐
              │              │ Bot muestra categorías:  │
              │              │ - Pizzas                 │
              │              │ - Hamburguesas           │
              │              │ - Tacos                  │
              │              │ - Alitas                 │
              │              │ - Bebidas                │
              │              └──────────────────────────┘
              │                           │
              │                           ▼
              │              ┌──────────────────────────┐
              │              │ Cliente selecciona:      │
              │              │ "Quiero una pizza"       │
              │              └──────────────────────────┘
              │                           │
              │                           ▼
              │              ┌──────────────────────────┐
              │              │ Bot pregunta detalles:   │
              │              │ - Tipo de pizza          │
              │              │ - Tamaño                 │
              │              │ - Extras                 │
              │              └──────────────────────────┘
              │                           │
              │                           ▼
              │              ┌──────────────────────────┐
              │              │ Cliente: "Parmesana      │
              │              │ grande con extra queso"  │
              │              └──────────────────────────┐
              │                           │             │
              │                           ▼             │
              │              ┌──────────────────────────┤
              │              │ Bot calcula total:       │
              │              │ - Pizza Parmesana: $270  │
              │              │ - Extra queso: $55       │
              │              │ = TOTAL: $325            │
              │              └──────────────────────────┘
              │                           │
              │                           ▼
              │              ┌──────────────────────────┐
              │              │ Bot: "¿Algo más?"        │
              │              └──────────────────────────┘
              │                           │
              │              ┌────────────┴────────────┐
              │              ▼                         ▼
              │     ┌────────────────┐      ┌──────────────────┐
              │     │  Sí, agregar   │      │  No, finalizar   │
              │     │  más productos │      │     pedido       │
              │     └────────────────┘      └──────────────────┘
              │              │                         │
              │              │ (loop)                  ▼
              │              └────────────┐  ┌──────────────────┐
              │                           │  │ Bot: Confirma    │
              │                           │  │ pedido completo  │
              │                           │  │ + Total          │
              │                           │  └──────────────────┘
              │                           │            │
              │                           │            ▼
              │                           │  ┌──────────────────┐
              │                           │  │ Bot: "¿Para      │
              │                           │  │ llevar o         │
              │                           │  │ entregar?"       │
              │                           │  └──────────────────┘
              │                           │            │
              │                           │  ┌─────────┴────────┐
              │                           │  ▼                  ▼
              │                           │ ┌─────────┐  ┌──────────┐
              │                           │ │ Delivery│  │ Recoger  │
              │                           │ └─────────┘  └──────────┘
              │                           │      │             │
              │                           │      ▼             │
              │                           │ ┌──────────────┐   │
              │                           │ │ Bot pide     │   │
              │                           │ │ dirección    │   │
              │                           │ └──────────────┘   │
              │                           │      │             │
              │                           │      └─────┬───────┘
              │                           │            ▼
              │                           │  ┌──────────────────┐
              │                           │  │ Bot: "¿Forma     │
              │                           │  │ de pago?"        │
              │                           │  │ - Efectivo       │
              │                           │  │ - Tarjeta        │
              │                           │  │ - Transferencia  │
              │                           │  └──────────────────┘
              │                           │            │
              │                           │            ▼
              │                           │  ┌──────────────────┐
              │                           │  │ PEDIDO CONFIRMADO│
              │                           │  │ Bot envía:       │
              │                           │  │ - # de pedido    │
              │                           │  │ - Tiempo estim.  │
              │                           │  │ - Teléfono       │
              │                           │  └──────────────────┘
              │                           │            │
              ▼                           ▼            ▼
    ┌──────────────────────────────────────────────────────┐
    │            NOTIFICACIÓN AL RESTAURANTE               │
    │  Sistema notifica al personal:                       │
    │  - Nuevo pedido recibido                            │
    │  - Detalles completos                               │
    │  - Datos de contacto del cliente                    │
    └──────────────────────────────────────────────────────┘
```

## 🤔 Flujo de Consultas

```
Cliente: "¿Qué pizzas tienen?"
        │
        ▼
Bot: Muestra categorías de pizzas
     - Clásicas (desde $80)
     - Premium (desde $100)
        │
        ▼
Cliente: "Cuéntame de la Parmesana"
        │
        ▼
Bot: Descripción detallada:
     "La Pizza Parmesana es nuestra especialidad,
     con peperoni, salami, salchicha italiana,
     jamón, tocino, queso parmesano fresco,
     champiñones, chile serrano, pimiento morrón
     y cebolla. ¡10 ingredientes deliciosos!"
     
     Precios:
     - Individual: $100
     - Mediana: $215
     - Grande: $270
     - Familiar: $325
```

## 🎁 Flujo de Promociones

```
Cliente: "¿Tienen promociones?"
        │
        ▼
Bot: "¡Sí! Tenemos el Mega Box 🎉
     
     Por solo $430 incluye:
     ✅ Pizza mediana (a tu elección)
     ✅ Super Sampler (alitas o boneless)
     ✅ Refresco 1.75L
     
     *Solo para llevar*
     
     ¿Te gustaría ordenarlo?"
```

## ❓ Flujo de Modificación de Pedido

```
Cliente: "Quiero cambiar algo de mi pedido"
        │
        ▼
Bot: "Sin problema. ¿Qué te gustaría cambiar?"
        │
        ▼
Cliente: "Cambiar el tamaño a familiar"
        │
        ▼
Bot: "Perfecto. He actualizado tu pedido:
     
     Pizza Parmesana Familiar: $325
     Extra queso: $60
     
     Nuevo total: $385
     
     ¿Algo más?"
```

## 🚫 Flujo de Cancelación

```
Cliente: "Necesito cancelar mi pedido"
        │
        ▼
Bot: "Entendido. ¿Estás seguro de que deseas
     cancelar el pedido #1234?"
     
     [Sí] [No, mantenerlo]
        │
        ▼
Cliente: "Sí"
        │
        ▼
Bot: "Tu pedido ha sido cancelado.
     Si cambias de opinión, con gusto
     podemos ayudarte a hacer uno nuevo. 😊"
```

## 📞 Flujo de Escalación a Humano

```
Situación: Bot no puede resolver
        │
        ▼
Bot: "Déjame conectarte con un miembro
     de nuestro equipo que podrá ayudarte
     mejor con esto.
     
     También puedes llamarnos directamente:
     📞 828-284-0040"
        │
        ▼
[Sistema notifica al personal]
```

## 🎯 Recomendaciones Inteligentes

El bot usa IA para:

1. **Sugerir complementos:**
   - Cliente pide pizza → Bot sugiere bebidas
   - Cliente pide hamburguesa → Bot sugiere papas extra

2. **Upselling inteligente:**
   - Cliente pide tamaño mediano → Bot menciona familiar ("solo $55 más")
   - Cliente pide simple → Bot menciona promoción

3. **Personalización:**
   - Recuerda pedidos anteriores
   - Sugiere favoritos del cliente
   - Adapta recomendaciones al horario

## ⏰ Gestión de Tiempo

```
HORARIOS DE ATENCIÓN:
- Bot: 24/7 (siempre disponible)
- Cocina: 12:00 PM - 11:00 PM

Fuera de horario:
Cliente: "Quiero pedir"
        │
        ▼
Bot: "Gracias por tu interés. 😊
     
     Actualmente estamos cerrados, pero
     puedes hacer tu pedido ahora y lo
     prepararemos cuando abramos mañana
     a las 12:00 PM.
     
     ¿Te gustaría continuar?"
```

## 📊 Métricas que el Bot Rastrea

- Tiempo de respuesta promedio
- Tasa de conversión (consulta → pedido)
- Productos más pedidos
- Horarios de mayor demanda
- Razones de cancelación
- Satisfacción del cliente

---

**El bot aprende y mejora con cada interacción. 🚀**
