// File: js/chatbox.js
// VERSIÓN INTERACTIVA MEJORADA

(function() {
    // --- ESTRUCTURA DE LA CONVERSACIÓN ---
  const chatTree = {
    'start': {
        message: '¡Hola! 👋 Bienvenido a Piccola. ¿En qué podemos ayudarte hoy?',
        options: [
            { text: '🍔 Ver estado de mi pedido', next: 'trackOrder' },
            { text: '🕒 Horarios y Ubicación', next: 'locationHours' },
            // --- OPCIÓN CAMBIADA ---
            { text: 'ℹ️ Alérgenos o Ingredientes', next: 'allergensIntro' },
        ]
    },
    'trackOrder': {
        message: '¡Claro! Por favor, ingresa el número de tu pedido (ej: #123) para rastrearlo.',
        isInput: true,
        next: 'orderStatus'
    },
    'orderStatus': {
        message: (input) => `Hemos revisado el pedido <strong>${input}</strong>. ¡Tu deliciosa hamburguesa ya salió de la cocina y está en camino! 🏍️ Debería llegar en unos 15 minutos.`,
        options: [
            { text: '↩️ Volver al menú principal', next: 'start' }
        ]
    },
    'locationHours': {
        message: 'Nos encuentras en <strong>Urb. San Luis cerca del parque Victor Raul</strong>. ¡Estamos abiertos de <strong>Lunes a Domingo, de 12:00 PM a 11:00 PM</strong>! Te esperamos. 😃',
        options: [
            { text: '↩️ Volver al menú principal', next: 'start' }
        ]
    },
    // --- NODO NUEVO: INTRODUCCIÓN A ALÉRGENOS ---
    'allergensIntro': {
        message: '¡Tu seguridad es nuestra prioridad! ¿Qué información necesitas?',
        options: [
            { text: 'Alérgenos comunes en nuestros productos', next: 'commonAllergens' },
            { text: 'Ingredientes de una hamburguesa', next: 'askForBurger' },
            { text: '↩️ Volver al menú principal', next: 'start' }
        ]
    },
    // --- NODO NUEVO: RESPUESTA DE ALÉRGENOS COMUNES ---
    'commonAllergens': {
        message: 'Nuestros panes contienen <strong>gluten</strong> y el queso contiene <strong>lactosa</strong>. Usamos aceite de girasol para freír. Si tienes una alergia severa, por favor contáctanos directamente antes de ordenar.',
        options: [
            { text: 'Ok, entendido', next: 'start' }
        ]
    },
    // --- NODO NUEVO: PREGUNTAR POR UNA HAMBURGUESA ESPECÍFICA ---
    'askForBurger': {
        message: '¡Por supuesto! ¿De qué hamburguesa te gustaría saber los ingredientes? (Ej: Doble Bacon)',
        isInput: true,
        next: 'burgerIngredients'
    },
    // --- NODO NUEVO: RESPUESTA SOBRE INGREDIENTES ---
    'burgerIngredients': {
        message: (burgerName) => {
            // Simulación de una respuesta basada en el input del usuario
            if (burgerName.toLowerCase().includes('veggie')) {
                return `La <strong>${burgerName}</strong> lleva: hamburguesa de lentejas, pan brioche, aguacate fresco, rúcula, tomate y nuestra mayonesa vegana. ¡Deliciosa! 🌱`;
            }
            return `La hamburguesa <strong>${burgerName}</strong> incluye: carne 100% de res, queso cheddar, pan artesanal y nuestros vegetales frescos. Si quieres saber más, ¡pregunta por un ingrediente específico!`;
        },
        options: [
            { text: 'Preguntar por otra hamburguesa', next: 'askForBurger' },
            { text: '↩️ Volver al menú principal', next: 'start' }
        ]
    },
}

    // --- LÓGICA DEL CHATBOX ---

    const chatboxHTML = `
        <div class="chatbox-container">
            <div class="chatbox-button">🍔</div>
            <div class="chatbox-window">
                <div class="chatbox-header"><h5>Asistente Piccola</h5><span class="chatbox-close">×</span></div>
                <div class="chatbox-body"></div>
                <div class="chatbox-footer">
                    <div class="chatbox-options"></div>
                    <div class="chatbox-input-area" style="display: none;">
                        <input type="text" placeholder="Escribe aquí...">
                        <button>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatboxHTML);

    const chatContainer = document.querySelector('.chatbox-container');
    const chatButton = chatContainer.querySelector('.chatbox-button');
    const chatWindow = chatContainer.querySelector('.chatbox-window');
    const closeButton = chatContainer.querySelector('.chatbox-close');
    const chatBody = chatContainer.querySelector('.chatbox-body');
    const optionsContainer = chatContainer.querySelector('.chatbox-options');
    const inputArea = chatContainer.querySelector('.chatbox-input-area');
    const textInput = inputArea.querySelector('input');
    const sendButton = inputArea.querySelector('button');

    // Función para mostrar mensajes
    function addMessage(text, sender = 'received') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<span>${text}</span>`;
        chatBody.appendChild(messageDiv);
        // Auto-scroll al final
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Función para mostrar el indicador de "escribiendo"
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received typing-indicator';
        typingDiv.innerHTML = '<span><i>Escribiendo...</i></span>';
        typingDiv.id = 'typing';
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingDiv = document.getElementById('typing');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    // Función para navegar por el árbol de conversación
    function navigateChat(nodeKey, userInput = null) {
        const node = chatTree[nodeKey];
        if (!node) return;

        optionsContainer.innerHTML = '';
        inputArea.style.display = 'none';

        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            const message = typeof node.message === 'function' ? node.message(userInput) : node.message;
            addMessage(message);

            if (node.options) {
                node.options.forEach(option => {
                    const button = document.createElement('button');
                    button.className = 'chat-option';
                    button.textContent = option.text;
                    button.addEventListener('click', () => {
                        addMessage(option.text, 'sent');
                        navigateChat(option.next);
                    });
                    optionsContainer.appendChild(button);
                });
            } else if (node.isInput) {
                inputArea.style.display = 'flex';
                textInput.focus();
                
                function submitInput() {
                    const value = textInput.value.trim();
                    if (value) {
                        addMessage(value, 'sent');
                        textInput.value = '';
                        navigateChat(node.next, value);
                    }
                }
                
                sendButton.onclick = submitInput; // Asigna el evento al botón
                textInput.onkeyup = (e) => { // Permite enviar con Enter
                    if(e.key === 'Enter') submitInput();
                };
            }
        }, 800); // Simula el tiempo de respuesta del bot
    }

    // Lógica para abrir/cerrar
    chatButton.addEventListener('click', () => {
        const isOpen = chatWindow.classList.toggle('open');
        chatButton.classList.toggle('open');
        if (isOpen && chatBody.childElementCount === 0) {
            // Inicia la conversación solo la primera vez que se abre
            navigateChat('start');
        }
    });

    closeButton.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        chatButton.classList.remove('open');
    });

})();