using Evo.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Adicione serviços ao container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configuração do Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString); // Ajuste conforme o seu banco de dados
});

// Configuração do CORS para permitir qualquer origem
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin", builder =>
    {
        builder
            .AllowAnyOrigin() // Permitir qualquer origem
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configura o pipeline de solicitação HTTP.
app.UseHttpsRedirection();



// Configuração para servir arquivos estáticos da pasta wwwroot
app.UseStaticFiles();

// Configuração adicional para servir arquivos da pasta "uploads"
var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadPath))
{
    Directory.CreateDirectory(uploadPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadPath),
    RequestPath = "/uploads"
});
app.UseCors("AllowAngularApp");
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.Run();
