using MeasuringApp.Hubs;

namespace MeassuringAppWebPage
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configuração básica dos serviços
            builder.Services.AddControllers();
            
            // Configuração do SignalR com o serviço Azure SignalR
            builder.Services.AddSignalR().AddAzureSignalR(options =>
            {
                options.ConnectionString = "Endpoint=https://carrinho-signalr.service.signalr.net;AccessKey=C0lkLm70OMEWC5UP6g9pfnvuE9iC9JPFxPyKfQEuBz1JUuNpsT67JQQJ99BDACZoyfiXJ3w3AAAAASRS9dAO;Version=1.0;";
            });

            // Política CORS para permitir conexões de diferentes origens
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    policy => policy
                        .SetIsOriginAllowed(_ => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            var app = builder.Build();

            // Configuração do pipeline de middleware
            app.UseStaticFiles();
            app.UseDefaultFiles();
            app.UseRouting();
            app.UseCors("CorsPolicy");
            
            // Mapeamento dos endpoints
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<SensorDataHub>("/sensordatahub");
                endpoints.MapControllers();
            });

            // Configuração específica para ambiente de desenvolvimento
            if (app.Environment.IsDevelopment())
            {
                app.Urls.Clear();
                app.Urls.Add("http://20.206.176.9");
            }

            app.Run();
        }
    }
}