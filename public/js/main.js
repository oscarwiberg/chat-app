const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// Catch message from server

socket.on('message', (message) => {
  console.log(message);

  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = e.target.elements.msg.value;

  socket.emit('chatMessage', message);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

const outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">Anna <span>9:12pm</span></p>
    <p class="text">
      ${message}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};
