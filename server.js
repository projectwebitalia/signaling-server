const express = require('express');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Servire una risposta semplice per la radice
app.get('/', (req, res) => {
  res.send('Il signaling server WebRTC è attivo!');
});

// Avvia il server HTTP
const server = app.listen(PORT, () => {
  console.log(`Server HTTP in ascolto su http://localhost:${PORT}`);
});

// Configurare il WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Nuovo client connesso!');

  ws.on('message', (message) => {
    console.log(`Messaggio ricevuto: ${message}`);
    // Inoltra il messaggio agli altri client
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnesso');
  });
});
