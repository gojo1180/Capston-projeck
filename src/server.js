// src/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// URL Server FastAPI Anda
const FASTAPI_URL = 'http://localhost:8000'; // Ganti jika port beda

// 1. Setup CORS
app.use(cors()); // Izinkan Express diakses dari domain lain

const io = new Server(server, {
  cors: {
    origin: "*", // Izinkan Socket.io diakses dari domain lain
    methods: ["GET", "POST"]
  }
});

// 2. Sajikan File Statis (Widget Anda)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// 3. Logika Inti Chatbot
io.on('connection', (socket) => {
  console.log(`✅ Widget terhubung: ${socket.id}`);

  // Terima pesan dari widget
  socket.on('pesan_dari_klien', async (msg) => {
    console.log(`💬 Pesan diterima: ${msg}`);
    try {
      // Teruskan ke FastAPI (asumsi endpoint /chat)
      const response = await axios.post(`${FASTAPI_URL}/chat`, {
        message: msg
        // Anda bisa tambahkan data lain, misal: user_id: '123'
      });

      // Dapatkan balasan dari FastAPI (asumsi format { reply: '...' })
      const balasanBot = response.data.reply || "Saya tidak mengerti.";

      // Kirim balasan kembali HANYA ke widget yang bertanya
      socket.emit('pesan_dari_server', balasanBot);

    } catch (error) {
      console.error('Error memanggil FastAPI:', error.message);
      socket.emit('pesan_dari_server', 'Maaf, AI sedang istirahat.');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Widget terputus: ${socket.id}`);
  });
});

// 4. Jalankan Server
server.listen(PORT, () => {
  console.log(`Server Node.js berjalan di http://localhost:${PORT}`);
  console.log(`Buka http://localhost:${PORT}/index.html untuk tes.`);
});