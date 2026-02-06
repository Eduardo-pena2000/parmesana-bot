/**
 * Script de prueba para simular conversaciones con el bot
 * Útil para testing sin necesidad de WhatsApp/Twilio
 */

require('dotenv').config();
const AIAssistant = require('./src/ai/assistant');
const readline = require('readline');

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

// Inicializar asistente
const assistant = new AIAssistant(process.env.ANTHROPIC_API_KEY);
const testPhoneNumber = '+521234567890'; // Número de prueba

console.log(`
${colors.bright}${colors.green}╔════════════════════════════════════════════════╗
║  🍕 LA PARMESANA - SIMULADOR DE CHATBOT 🤖   ║
╚════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}Instrucciones:${colors.reset}
- Escribe mensajes como si fueras un cliente
- Escribe 'salir' para terminar
- Escribe 'limpiar' para reiniciar conversación
- Escribe 'pedido' para ver resumen del pedido actual

${colors.blue}¡Conversación iniciada!${colors.reset}
`);

function askQuestion() {
  rl.question(`${colors.green}Cliente:${colors.reset} `, async (input) => {
    const message = input.trim();

    if (!message) {
      askQuestion();
      return;
    }

    // Comandos especiales
    if (message.toLowerCase() === 'salir') {
      console.log(`\n${colors.yellow}¡Hasta luego! 👋${colors.reset}\n`);
      rl.close();
      process.exit(0);
      return;
    }

    if (message.toLowerCase() === 'limpiar') {
      assistant.clearHistory(testPhoneNumber);
      console.log(`\n${colors.yellow}✨ Conversación reiniciada${colors.reset}\n`);
      askQuestion();
      return;
    }

    if (message.toLowerCase() === 'pedido') {
      try {
        const summary = await assistant.extractOrderSummary(testPhoneNumber);
        console.log(`\n${colors.yellow}📋 Resumen del pedido:${colors.reset}`);
        console.log(JSON.stringify(summary, null, 2));
        console.log('');
      } catch (error) {
        console.log(`${colors.yellow}No hay pedido activo aún${colors.reset}\n`);
      }
      askQuestion();
      return;
    }

    // Procesar mensaje normal
    try {
      const response = await assistant.processMessage(testPhoneNumber, message);
      console.log(`\n${colors.blue}Bot:${colors.reset} ${response}\n`);
    } catch (error) {
      console.error(`${colors.yellow}Error: ${error.message}${colors.reset}\n`);
    }

    askQuestion();
  });
}

// Mensaje de bienvenida automático
(async () => {
  try {
    const welcomeMessage = await assistant.processMessage(testPhoneNumber, 'Hola');
    console.log(`${colors.blue}Bot:${colors.reset} ${welcomeMessage}\n`);
    askQuestion();
  } catch (error) {
    console.error(`${colors.yellow}Error iniciando conversación: ${error.message}${colors.reset}`);
    console.log(`\n${colors.yellow}Verifica que tu ANTHROPIC_API_KEY esté configurada en .env${colors.reset}\n`);
    process.exit(1);
  }
})();
