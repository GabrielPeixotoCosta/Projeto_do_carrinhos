using Microsoft.AspNetCore.SignalR;

namespace MeasuringApp.Hubs
{
    public class SensorDataHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Cliente conectado: {Context.ConnectionId}");
            await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public async Task SendAccelerometerData(object data)
        {
            Console.WriteLine($"Dados do acelerômetro recebidos de {Context.ConnectionId}: {System.Text.Json.JsonSerializer.Serialize(data)}");
            await Clients.All.SendAsync("ReceiveAccelerometerData", data);
        }

        public async Task SendCompassData(object data)
        {
            Console.WriteLine($"Dados da bússola recebidos de {Context.ConnectionId}: {System.Text.Json.JsonSerializer.Serialize(data)}");
            await Clients.All.SendAsync("ReceiveCompassData", data);
        }

        public async Task SendGyroscopeData(object data)
        {
            Console.WriteLine($"Dados do giroscópio recebidos de {Context.ConnectionId}: {System.Text.Json.JsonSerializer.Serialize(data)}");
            await Clients.All.SendAsync("ReceiveGyroscopeData", data);
        }

        // Método para receber comandos do controle do carrinho
        public async Task SendCarCommand(object data)
        {
            Console.WriteLine($"Comando do carrinho recebido de {Context.ConnectionId}: {System.Text.Json.JsonSerializer.Serialize(data)}");
            await Clients.All.SendAsync("ReceiveCarCommand", data);
        }

        // Método para receber imagens capturadas periodicamente
        public async Task SendPeriodicImage(string imageData)
        {
            Console.WriteLine($"Imagem periódica recebida de {Context.ConnectionId}");
            await Clients.All.SendAsync("ReceivePeriodicImage", imageData);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Cliente desconectado: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
