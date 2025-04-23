using MeasuringApp.Hubs;

namespace MeassuringAppWebPage
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });

            // Configuração CORS para permitir conexões do dispositivo móvel
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .SetIsOriginAllowed((host) => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // NOTA: Para futura integração com Azure SignalR Service, descomente e configure abaixo
            // builder.Services.AddSignalR().AddAzureSignalR(options =>
            // {
            //     options.ConnectionString = "Sua_String_De_Conexão_Do_Azure_SignalR";
            //     // Você pode obter a string de conexão no portal do Azure após criar um serviço Azure SignalR
            //     // Formato: Endpoint=https://your-signalr-service.service.signalr.net;AccessKey=your-access-key;Version=1.0;
            // }) ;

            var app = builder.Build();

            app.UseStaticFiles();
            app.UseDefaultFiles();
            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<SensorDataHub>("/sensordatahub");
                endpoints.MapControllers();
            });
// Configurar para aceitar conexões de qualquer endereço IP
        if (app.Environment.IsDevelopment())
{
        app.Urls.Clear();
        app.Urls.Add("http://20.206.176.9") ;
}

            app.Run();
        }
    }
}