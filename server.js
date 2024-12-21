const WebSocket = require('ws');
const express = require('express');

// Configura Express per servire una pagina web
const app = express();
const PORT = 3000;
app.use(express.static('public')); // Serve file statici dalla cartella 'public'

// Crea un WebSocket server
const server = app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nuovo client connesso.');

    // Gestisce i messaggi ricevuti dai client
    ws.on('message', (message) => {
        console.log(`Messaggio ricevuto: ${message}`);

        // Inoltra il messaggio a tutti gli altri client connessi
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Gestisce la disconnessione del client
    ws.on('close', () => {
        console.log('Client disconnesso.');
    });
});
