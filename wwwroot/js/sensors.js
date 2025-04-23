/**
 * Gerenciamento de sensores do dispositivo móvel
 * Responsável por capturar e exibir dados do acelerômetro, giroscópio e bússola
 */

class SensorManager {
    constructor() {
        // Elementos de exibição do acelerômetro
        this.accelX = document.getElementById('xValue');
        this.accelY = document.getElementById('yValue');
        this.accelZ = document.getElementById('zValue');
        
        // Elementos de exibição do giroscópio
        this.gyroX = document.getElementById('gyroXValue');
        this.gyroY = document.getElementById('gyroYValue');
        this.gyroZ = document.getElementById('gyroZValue');
        
        // Elementos de exibição da bússola
        this.compassValue = document.getElementById('compassValue');
        
        // Valores atuais dos sensores
        this.currentAccel = { x: 0, y: 0, z: 0 };
        this.currentGyro = { x: 0, y: 0, z: 0 };
        this.currentCompass = { heading: 0 };
        
        // Inicializar sensores se disponíveis
        this.checkSensors();
    }
    
    // Verifica se os sensores estão disponíveis
    checkSensors() {
        if (window.DeviceMotionEvent || window.DeviceOrientationEvent) {
            console.log("Sensores disponíveis no dispositivo");
        } else {
            console.log("Sensores não disponíveis neste dispositivo");
        }
    }
    
    // Atualiza os dados do acelerômetro
    updateAccelerometerData(data) {
        // Atualizar valores numéricos
        this.currentAccel = data;
        if (this.accelX) this.accelX.textContent = data.x.toFixed(2);
        if (this.accelY) this.accelY.textContent = data.y.toFixed(2);
        if (this.accelZ) this.accelZ.textContent = data.z.toFixed(2);
        
        // Adicionar classe de animação
        if (this.accelX) this.accelX.parentElement.classList.add('data-update');
        if (this.accelY) this.accelY.parentElement.classList.add('data-update');
        if (this.accelZ) this.accelZ.parentElement.classList.add('data-update');
        
        // Remover classe após animação
        setTimeout(() => {
            if (this.accelX) this.accelX.parentElement.classList.remove('data-update');
            if (this.accelY) this.accelY.parentElement.classList.remove('data-update');
            if (this.accelZ) this.accelZ.parentElement.classList.remove('data-update');
        }, 500);
        
        // Atualizar timestamp
        document.getElementById('timestamp').textContent = new Date().toLocaleTimeString();
    }
    
    // Atualiza os dados do giroscópio
    updateGyroscopeData(data) {
        // Atualizar valores numéricos
        this.currentGyro = data;
        if (this.gyroX) this.gyroX.textContent = data.x.toFixed(2);
        if (this.gyroY) this.gyroY.textContent = data.y.toFixed(2);
        if (this.gyroZ) this.gyroZ.textContent = data.z.toFixed(2);
        
        // Adicionar classe de animação
        if (this.gyroX) this.gyroX.parentElement.classList.add('data-update');
        if (this.gyroY) this.gyroY.parentElement.classList.add('data-update');
        if (this.gyroZ) this.gyroZ.parentElement.classList.add('data-update');
        
        // Remover classe após animação
        setTimeout(() => {
            if (this.gyroX) this.gyroX.parentElement.classList.remove('data-update');
            if (this.gyroY) this.gyroY.parentElement.classList.remove('data-update');
            if (this.gyroZ) this.gyroZ.parentElement.classList.remove('data-update');
        }, 500);
        
        // Atualizar timestamp
        document.getElementById('timestampG').textContent = new Date().toLocaleTimeString();
    }
    
    // Atualiza os dados da bússola
    updateCompassData(data) {
        // Atualizar valores numéricos
        this.currentCompass = data;
        if (this.compassValue) this.compassValue.textContent = data.c.toFixed(2);
        
        // Adicionar classe de animação
        if (this.compassValue) this.compassValue.parentElement.classList.add('data-update');
        
        // Remover classe após animação
        setTimeout(() => {
            if (this.compassValue) this.compassValue.parentElement.classList.remove('data-update');
        }, 500);
        
        // Atualizar timestamp
        document.getElementById('timestampC').textContent = new Date().toLocaleTimeString();
    }
    
    // Solicita permissão e inicia os sensores do dispositivo
    requestSensors() {
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requer permissão explícita
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.startSensors();
                    } else {
                        console.error('Permissão para sensores negada');
                        alert('É necessário permitir o acesso aos sensores para usar este aplicativo.');
                    }
                })
                .catch(console.error);
        } else {
            // Outros navegadores
            this.startSensors();
        }
    }
    
    // Inicia os sensores do dispositivo
    startSensors() {
        // Acelerômetro e giroscópio via DeviceOrientation
        window.addEventListener('deviceorientation', (event) => {
            const gyroData = {
                x: event.alpha || 0, // Z
                y: event.beta || 0,   // X
                z: event.gamma || 0  // Y
            };
            this.updateGyroscopeData(gyroData);
            
            // Enviar para o servidor
            if (window.connection && window.connection.state === signalR.HubConnectionState.Connected) {
                window.connection.invoke("SendGyroscopeData", gyroData).catch(err => {
                    console.error("Erro ao enviar dados do giroscópio:", err);
                });
            }
        });
        
        // Acelerômetro via DeviceMotion
        window.addEventListener('devicemotion', (event) => {
            const accel = event.accelerationIncludingGravity;
            if (accel) {
                const accelData = {
                    x: accel.x || 0,
                    y: accel.y || 0,
                    z: accel.z || 0
                };
                this.updateAccelerometerData(accelData);
                
                // Enviar para o servidor
                if (window.connection && window.connection.state === signalR.HubConnectionState.Connected) {
                    window.connection.invoke("SendAccelerometerData", accelData).catch(err => {
                        console.error("Erro ao enviar dados do acelerômetro:", err);
                    });
                }
            }
        });
        
        // Bússola
        if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
            window.addEventListener('deviceorientationabsolute', (event) => {
                if (event.alpha !== null) {
                    const compassData = { c: event.alpha };
                    this.updateCompassData(compassData);
                    
                    // Enviar para o servidor
                    if (window.connection && window.connection.state === signalR.HubConnectionState.Connected) {
                        window.connection.invoke("SendCompassData", compassData).catch(err => {
                            console.error("Erro ao enviar dados da bússola:", err);
                        });
                    }
                }
            });
        }
    }
}

// Exportar para uso em outros arquivos
window.SensorManager = SensorManager;
