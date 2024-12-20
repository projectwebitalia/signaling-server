const express = require('express');
const { WebSocketServer } = require('ws');

const app = express();

// Usa la variabile d'ambiente PORT (Render la fornisce automaticamente) o imposta un valore predefinito per il test locale
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Il signaling server WebRTC è attivo!');
});

const server = app.listen(PORT, () => {
  console.log(`Server HTTP in ascolto su http://localhost:${PORT}`);
});

// Configurare WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Nuovo client connesso!');
  
  ws.on('message', (message) => {
    console.log(`Messaggio ricevuto: ${message}`);
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
