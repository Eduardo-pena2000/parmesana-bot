/**
 * DEMO DEL CHATBOT - SIN NECESIDAD DE API
 * Versión simulada para probar sin costos
 */

const readline = require('readline');
const menu = require('./src/data/menu.json');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Estado de la conversación
let cart = [];
let conversationState = 'greeting';

console.log(`
${colors.bright}${colors.green}╔════════════════════════════════════════════════╗
║  🍕 LA PARMESANA - DEMO CHATBOT (SIN API) 🤖  ║
╚════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}VERSIÓN DEMO:${colors.reset}
Esta versión funciona SIN necesidad de API ni costos.
Usa respuestas inteligentes pregrabadas para demostrar
cómo funcionaría el bot real.

${colors.yellow}Comandos:${colors.reset}
- Escribe naturalmente como un cliente
- 'carrito' - ver tu pedido actual
- 'limpiar' - reiniciar conversación
- 'salir' - terminar

${colors.blue}¡Conversación iniciada!${colors.reset}
`);

// Función de respuesta inteligente
function getBotResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  // Saludos
  if (msg.match(/^(hola|hi|hello|buenos|buenas|hey)/)) {
    conversationState = 'menu_selection';
    return `¡Hola! 😊 Bienvenido a La Parmesana - "Sabor y calidad que distingue"

Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?

📋 Opciones:
1️⃣ Ver el menú completo
2️⃣ Hacer un pedido
3️⃣ Preguntar sobre promociones
4️⃣ Información del restaurante

¿Qué te gustaría hacer?`;
  }
  
  // Ver menú
  if (msg.match(/menu|carta|platillos|comida|tienen|opciones|1/)) {
    conversationState = 'browsing_menu';
    return `🍕 MENÚ DE LA PARMESANA

🍕 **PIZZAS:**
   • Clásicas (desde $80) - Peperoni, Hawaiana, Mexicana, etc.
   • Premium (desde $100) - Parmesana ⭐, Meat Lover, 5 Quesos, etc.
   
🍔 **HAMBURGUESAS:** (desde $145)
   • Sirloin, Deluxe, Chicken, Fit Burger
   
🌮 **TACOS:** (desde $145)
   • Al Pastor, Arrachera, Alambre
   
🍗 **ALITAS Y BONELESS:** (desde $105)
   • Múltiples tamaños y salsas
   
🍝 **PASTAS:** (desde $110)
   • Parmesana, Alfredo, Bolognesa, Lasagna
   
🥗 **ENSALADAS:** (desde $80)
   
🍺 **BEBIDAS Y POSTRES**

🎁 **PROMOCIÓN ESPECIAL:**
   Mega Box $430 - Pizza mediana + Super Sampler + Refresco 1.75L

¿Qué categoría te interesa?`;
  }
  
  // Pizzas
  if (msg.match(/pizza/)) {
    conversationState = 'pizza_selection';
    return `🍕 NUESTRAS PIZZAS

⭐ **PIZZA PARMESANA** (Nuestra especialidad)
   La estrella de la casa con 10 ingredientes:
   Peperoni, salami, salchicha italiana, jamón, tocino,
   queso parmesano fresco, champiñones, chile serrano,
   pimiento morrón y cebolla.
   
   📏 Tamaños:
   • Individual: $100
   • Mediana: $215
   • Grande: $270
   • Familiar: $325

🍕 **PIZZAS CLÁSICAS** (desde $80)
   • Peperoni - Clásica y deliciosa
   • Hawaiana - Jamón y piña
   • Mexicana - Chorizo, frijoles, morrón
   • Vegetariana - Todo el sabor vegetal
   
🍕 **PIZZAS PREMIUM** (desde $100)
   • Meat Lover - Para los carnívoros
   • 5 Quesos - Irresistible
   • La Grill - Con arrachera
   • Chicken Boneless - Con salsa búfalo

➕ **EXTRAS:**
   • Queso extra: +$30-60 según tamaño
   • Orilla de queso muncher: +$25-75

¿Cuál pizza te gustaría ordenar?`;
  }
  
  // Parmesana específica
  if (msg.match(/parmesana/)) {
    conversationState = 'size_selection';
    return `¡Excelente elección! 🍕⭐ 

La **Pizza Parmesana** es nuestra especialidad de la casa.
Lleva 10 ingredientes premium terminando con queso parmesano fresco.

📏 **¿Qué tamaño prefieres?**
• Individual (1-2 personas): $100
• Mediana (2-3 personas): $215
• Grande (3-4 personas): $270
• Familiar (4-5 personas): $325

También puedes agregar:
• Extra queso: +$30-60
• Orilla de queso muncher: +$25-75`;
  }
  
  // Tamaños
  if (msg.match(/grande|mediana|familiar|individual/)) {
    let size = '';
    let price = 0;
    
    if (msg.includes('grande')) { size = 'Grande'; price = 270; }
    else if (msg.includes('mediana')) { size = 'Mediana'; price = 215; }
    else if (msg.includes('familiar')) { size = 'Familiar'; price = 325; }
    else if (msg.includes('individual')) { size = 'Individual'; price = 100; }
    
    cart.push({
      item: `Pizza Parmesana ${size}`,
      price: price,
      quantity: 1
    });
    
    conversationState = 'add_more';
    return `✅ Agregado: Pizza Parmesana ${size} - $${price}

¿Deseas agregar algo más? Por ejemplo:
• Bebidas (desde $15)
• Entradas (desde $30)
• Postres (desde $55)
• Otra pizza o platillo

O escribe "finalizar" para confirmar tu pedido.`;
  }
  
  // Hamburguesas
  if (msg.match(/hamburguesa|burger/)) {
    return `🍔 NUESTRAS HAMBURGUESAS

Todas incluyen papas a la francesa:

🥩 **SIRLOIN BURGER** - $150
   150gr de sirloin, queso mozzarella y cheddar,
   aros de cebolla, lechuga, tomate

🥩 **DELUXE BURGER** - $165
   Todo lo anterior + tocino, cebolla caramelizada,
   champiñones, la más completa

🍗 **CHICKEN BURGER** - $150
   Tender de pollo, mozzarella, lechuga,
   cebolla morada, zanahoria

🥗 **FIT BURGER** - $145
   Lechuga orejona, carne a la parrilla,
   queso panela, aguacate (opción saludable)

🧀 **SANDWICH PECHUGA FUNDIDA** - $180
   Media pechuga, tocino, mezcla de quesos

¿Cuál te gustaría ordenar?`;
  }
  
  // Tacos
  if (msg.match(/taco/)) {
    return `🌮 NUESTROS TACOS (300gr)

Todos incluyen frijoles charros, salsas y cebolla morada:

🌮 **TACOS AL PASTOR** - $145
   Lomo de cerdo al pastor tradicional
   (Con queso +$15)

🥩 **TACOS DE ARRACHERA** - $235
   Arrachera importada de calidad
   (Con queso +$15)

🌮 **TACOS DE ALAMBRE** - $165
   Arrachera, salchicha, morrón, cebolla y queso

🧀 **EN COSTRA DE QUESO** (4 piezas):
   • Al Pastor: $185
   • Alambre: $210
   • Arrachera: $280

¿Cuál te llama la atención?`;
  }
  
  // Bebidas
  if (msg.match(/bebida|tomar|refresco|agua|coca|pepsi/)) {
    return `🥤 BEBIDAS

💧 **AGUAS:**
   • Agua natural: $15
   • Agua de limón: $35
   • Agua limón con pepino: $40
   • Limonada con mineral: $40

🥤 **REFRESCOS:**
   • Refresco regular: $35
   • Refresco 1.75L (para llevar): $65

☕ **CALIENTES:**
   • Café americano: $45
   • Capuccino: $65
   • Chocolate caliente: $45

🍨 **MALTEADAS:** ($105)
   • Vainilla, Fresa, Chocolate
   • Mazapán, Caramelo

¿Qué te gustaría tomar?`;
  }
  
  // Promociones
  if (msg.match(/promoci[oó]n|oferta|especial|descuento|deal|3/)) {
    return `🎁 PROMOCIÓN ESPECIAL - MEGA BOX

📦 **MEGA BOX - $430** (Solo para llevar)

Incluye:
✅ Pizza mediana (a tu elección)
✅ Super Sampler (alitas o boneless + entradas)
✅ Refresco de 1.75L

¡Perfecto para compartir en familia!

*Promoción disponible solo para pedidos para llevar*

¿Te gustaría ordenar el Mega Box?`;
  }
  
  // Ver carrito
  if (msg.match(/carrito|pedido|orden|total/)) {
    if (cart.length === 0) {
      return `Tu carrito está vacío. 😊

¿Qué te gustaría ordenar? Puedo mostrarte:
• Pizzas
• Hamburguesas
• Tacos
• Alitas
• O el menú completo`;
    }
    
    let total = 0;
    let cartText = '🛒 TU PEDIDO ACTUAL:\n\n';
    cart.forEach((item, index) => {
      cartText += `${index + 1}. ${item.item} - $${item.price}\n`;
      total += item.price;
    });
    cartText += `\n💰 TOTAL: $${total}\n\n`;
    cartText += `¿Deseas agregar algo más o finalizar el pedido?`;
    
    return cartText;
  }
  
  // Finalizar pedido
  if (msg.match(/finalizar|confirmar|listo|eso es todo|nada m[aá]s/)) {
    if (cart.length === 0) {
      return `No tienes productos en tu carrito aún. 😊

¿Qué te gustaría ordenar?`;
    }
    
    let total = 0;
    let orderText = '📋 RESUMEN DE TU PEDIDO:\n\n';
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.item} - $${item.price}\n`;
      total += item.price;
    });
    orderText += `\n💰 TOTAL: $${total}\n\n`;
    orderText += `¿Para llevar o entregar a domicilio?\n\n`;
    orderText += `📞 También puedes llamarnos:\n`;
    orderText += `   • 828-284-0040\n`;
    orderText += `   • 828-122-9834\n`;
    orderText += `   • 828-148-3318\n\n`;
    orderText += `*En la versión real, aquí tomaríamos tu dirección y confirmaríamos el pedido*`;
    
    return orderText;
  }
  
  // Información del restaurante
  if (msg.match(/informaci[oó]n|direcci[oó]n|ubicaci[oó]n|tel[eé]fono|horario|d[oó]nde|4/)) {
    return `📍 LA PARMESANA - INFORMACIÓN

📞 **TELÉFONOS:**
   • 828-284-0040
   • 828-122-9834
   • 828-148-3318
   • 828-100-5914

📍 **UBICACIÓN:**
   Cadereyta Jiménez, Nuevo León

📱 **REDES SOCIALES:**
   • Facebook: @LAPARMESANACADEREYTA
   • Instagram: @LA.PARMESANA.CADEREYTA

🍕 **ESPECIALIDAD:**
   Pizza Parmesana - "Sabor y calidad que distingue"

⏰ **HORARIO:**
   Consultar por teléfono

¿En qué más puedo ayudarte?`;
  }
  
  // Respuesta por defecto
  return `Entiendo. 😊 

Puedo ayudarte con:
• Ver el menú completo
• Hacer un pedido
• Información sobre pizzas, hamburguesas, tacos
• Promociones especiales
• Información del restaurante

¿Qué te gustaría saber?`;
}

// Iniciar conversación
console.log(`${colors.blue}Bot:${colors.reset} ${getBotResponse('Hola')}\n`);

function askQuestion() {
  rl.question(`${colors.green}Cliente:${colors.reset} `, (input) => {
    const message = input.trim();

    if (!message) {
      askQuestion();
      return;
    }

    // Comandos especiales
    if (message.toLowerCase() === 'salir') {
      console.log(`\n${colors.yellow}¡Gracias por probar el demo! 👋${colors.reset}`);
      console.log(`\n${colors.bright}VERSIÓN COMPLETA:${colors.reset}`);
      console.log(`La versión real con IA de Claude ofrece:`);
      console.log(`✅ Conversación mucho más natural y fluida`);
      console.log(`✅ Entiende cualquier forma de preguntar`);
      console.log(`✅ Recomendaciones personalizadas`);
      console.log(`✅ Aprende de cada interacción`);
      console.log(`✅ Gestiona pedidos complejos automáticamente\n`);
      rl.close();
      process.exit(0);
      return;
    }

    if (message.toLowerCase() === 'limpiar') {
      cart = [];
      conversationState = 'greeting';
      console.log(`\n${colors.yellow}