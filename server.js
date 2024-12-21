const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

// Imposta una risposta per la root
app.get('/', (req, res) => {
  res.send('Signaling server attivo!');
});

// Crea il server HTTP
const server = app.listen(port, () => {
  console.log(`Server HTTP in ascolto su http://localhost:${port}`);
});

// Crea il server WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Un nuovo client è connesso!');

  // Gestisce la ricezione di messaggi dai client
  ws.on('message', (message) => {
    console.log('Messaggio ricevuto:', message);

    // Verifica se il messaggio è un Blob (i dati video inviati dal broadcaster)
    if (message instanceof Buffer) {
      console.log('Messaggio binario ricevuto: probabilmente un flusso video');
      // Inoltra il messaggio a tutti i client connessi
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);  // Invia il Blob al client
        }
      });
    } else {
      console.log('Messaggio non binario, ignorato');
    }
  });

  // Gestisce la disconnessione di un client
  ws.on('close', () => {
    console.log('Un client si è disconnesso');
  });

  // Gestione degli errori di WebSocket
  ws.onerror = (error) => {
    console.error('Errore WebSocket:', error);
  };
});

