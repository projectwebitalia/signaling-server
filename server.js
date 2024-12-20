const WebSocket = require('ws');
const express = require('express');

// Configura il server HTTP con Express
const app = express();
const port = process.env.PORT || 3000;

// Serve eventuali file statici (opzionale)
app.use(express.static('public'));

// Crea il server HTTP
const server = app.listen(port, () => {
    console.log(`Signaling server in esecuzione su porta ${port}`);
});

// Configura WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nuovo client connesso');

    ws.on('message', (message) => {
        console.log('Messaggio ricevuto:', message);

        // Invia il messaggio a tutti i client connessi tranne il mittente
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnesso');
    });
});