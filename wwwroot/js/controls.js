/**
 * Controle de Carrinho
 * Responsável por gerenciar os controles direcionais do carrinho
 */

class CarController {
    constructor() {
        // Botões de controle
        this.forwardBtn = document.getElementById('forward-btn');
        this.backwardBtn = document.getElementById('backward-btn');
        this.leftBtn = document.getElementById('left-btn');
        this.rightBtn = document.getElementById('right-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.directionStatus = document.getElementById('direction-status');
        
        // Estado atual do carrinho
        this.currentDirection = 'stop';
        
        // Inicializar eventos
        this.initEvents();
    }
    
    // Inicializa os eventos dos botões
    initEvents() {
        // Eventos de clique
        if (this.forwardBtn) this.forwardBtn.addEventListener('click', () => this.move('forward'));
        if (this.backwardBtn) this.backwardBtn.addEventListener('click', () => this.move('backward'));
        if (this.leftBtn) this.leftBtn.addEventListener('click', () => this.move('left'));
        if (this.rightBtn) this.rightBtn.addEventListener('click', () => this.move('right'));
        if (this.stopBtn) this.stopBtn.addEventListener('click', () => this.move('stop'));
        
        // Eventos de toque para dispositivos móveis
        if (this.forwardBtn) {
            this.forwardBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.move('forward');
            });
        }
        
        if (this.backwardBtn) {
            this.backwardBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.move('backward');
            });
        }
        
        if (this.leftBtn) {
            this.leftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.move('left');
            });
        }
        
        if (this.rightBtn) {
            this.rightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.move('right');
            });
        }
        
        if (this.stopBtn) {
            this.stopBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.move('stop');
            });
        }
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.move('forward');
                    break;
                case 'ArrowDown':
                    this.move('backward');
                    break;
                case 'ArrowLeft':
                    this.move('left');
                    break;
                case 'ArrowRight':
                    this.move('right');
                    break;
                case ' ': // Espaço
                    this.move('stop');
                    break;
            }
        });
    }
    
    // Método para mover o carrinho
    move(direction) {
        // Atualizar estado atual
        this.currentDirection = direction;
        
        // Remover classe ativa de todos os botões
        if (this.forwardBtn) this.forwardBtn.classList.remove('active');
        if (this.backwardBtn) this.backwardBtn.classList.remove('active');
        if (this.leftBtn) this.leftBtn.classList.remove('active');
        if (this.rightBtn) this.rightBtn.classList.remove('active');
        if (this.stopBtn) this.stopBtn.classList.remove('active');
        
        // Adicionar classe ativa ao botão correspondente
        switch(direction) {
            case 'forward':
                if (this.forwardBtn) this.forwardBtn.classList.add('active');
                break;
            case 'backward':
                if (this.backwardBtn) this.backwardBtn.classList.add('active');
                break;
            case 'left':
                if (this.leftBtn) this.leftBtn.classList.add('active');
                break;
            case 'right':
                if (this.rightBtn) this.rightBtn.classList.add('active');
                break;
            case 'stop':
                if (this.stopBtn) this.stopBtn.classList.add('active');
                break;
        }
        
        // Atualizar status de direção
        if (this.directionStatus) {
            this.directionStatus.textContent = direction.charAt(0).toUpperCase() + direction.slice(1);
        }
        
        // Enviar comando para o servidor via SignalR
        if (window.connection && window.connection.state === signalR.HubConnectionState.Connected) {
            window.connection.invoke("SendCarCommand", { direction }).catch(err => {
                console.error("Erro ao enviar comando:", err);
            });
        } else {
            console.log("Comando (não enviado, sem conexão):", direction);
        }
        
        // Feedback visual
        this.animateButton(direction);
    }
    
    // Animação de feedback visual
    animateButton(direction) {
        let button;
        
        switch(direction) {
            case 'forward':
                button = this.forwardBtn;
                break;
            case 'backward':
                button = this.backwardBtn;
                break;
            case 'left':
                button = this.leftBtn;
                break;
            case 'right':
                button = this.rightBtn;
                break;
            case 'stop':
                button = this.stopBtn;
                break;
        }
        
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Método para obter a direção atual
    getCurrentDirection() {
        return this.currentDirection;
    }
}

// Exportar para uso em outros arquivos
window.CarController = CarController;
