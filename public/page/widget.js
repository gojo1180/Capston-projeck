// public/page/widget.js
(function() {
  
  // Alamat server Node.js Anda
  const SERVER_URL = 'http://localhost:3000'; 
  
  // <-- HAPUS FUNGSI getMockResponse() DARI SINI -->

  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function initWidget() {
    loadCSS('/style/widget.css'); // Path sudah benar

    // ... (Kode HTML untuk buat chatButton dan chatWindow tetap SAMA) ...
    // (copy-paste dari file lama Anda)
    // ...
    // 2. Buat HTML untuk widget
    const chatButton = document.createElement('button');
    chatButton.innerText = 'Chat';
    chatButton.className = 'chat-button';
    
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
chatWindow.innerHTML = `
      <div class="chat-header">Learning Buddy</div>
      <div class="chat-body">
        <div class="chat-message server">
          Halo! Saya Learning Buddy, siap membantu Anda.
        </div>
      </div>
      
      <div class="chat-footer">
        <input type="text" class="chat-input" placeholder="Ketik pesan...">
        <button class="send-button">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    `;
    
    chatWindow.style.display = 'none';

    document.body.appendChild(chatButton);
    document.body.appendChild(chatWindow);

    // --- LOGIKA BARU ---
    // 5. Setup koneksi Socket.io
  const socket = io(SERVER_URL);
    const chatBody = chatWindow.querySelector('.chat-body');
    const chatInput = chatWindow.querySelector('.chat-input');
    
    // TAMBAHKAN INI:
    const sendButton = chatWindow.querySelector('.send-button');

    // Buat satu fungsi untuk mengirim
    function sendMessage() {
      const msg = chatInput.value.trim();
      if (msg !== '') {
        appendMessage(msg, 'klien'); // Tampilkan pesan kita
        socket.emit('pesan_dari_klien', msg); // Kirim ke server
        chatInput.value = '';
      }
    }

    // Ubah event 'onkeydown'
    chatInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    // TAMBAHKAN INI:
    sendButton.onclick = () => {
      sendMessage();
    };

    chatButton.onclick = () => {
      chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
    };

    function appendMessage(msg, sender) {
      const msgElement = document.createElement('div');
      msgElement.className = `chat-message ${sender}`;
      msgElement.innerText = msg;
      chatBody.appendChild(msgElement);
      chatBody.scrollTop = chatBody.scrollHeight; 
    }

    // 7. Terima balasan dari server
    socket.on('pesan_dari_server', (balasan) => {
      appendMessage(balasan, 'server'); // Tampilkan pesan bot
    });

    socket.on('connect', () => {
      console.log('Terhubung ke server Node.js via Socket.io');
    });
    // --- AKHIR LOGIKA BARU ---
  }

  initWidget();

})();