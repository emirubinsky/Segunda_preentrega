<h1>Chat</h1>
<form action="messages/addMessage" method="POST" id="messageForm">
    <input type="text" id="user" name="user" placeholder="Nombre de usuario" required>
    <input type="text" id="message" name="message" placeholder="Mensaje" required>
<h1>Chat</h1>
<form action="messages/addMessage" method="POST" id="messageForm">
    <input type="text" id="user" name="user" placeholder="Nombre de usuario" required>
    <input type="text" id="message" name="message" placeholder="Mensaje" required>
    <button type="submit">Enviar mensaje</button>
</form>

<div class="chat-container">
<div class="row" id="chatList">
        {{#each messages}}
        <div class="col-md-4 mb-4">
            <div class="card">
                <h2>usuario: {{this.user}}</h2>
                <p>mensaje: {{this.text}}</p>
            </div>
        </div>
        {{/each}}
    </div>
</div>

<script src="/socket.io/socket.io.js"></script>
<script type="module" src="/js/chat.js"></script>