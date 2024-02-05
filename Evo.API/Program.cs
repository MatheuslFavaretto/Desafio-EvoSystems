
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


// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder.WithOrigins("http://localhost:4200") // Adapte conforme necessário
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

// Configura o pipeline de solicitação HTTP.
app.UseHttpsRedirection();

// Aplica a configuração do CORS - Deve estar antes de UseRouting()
app.UseCors("AllowAngularApp");

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


app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
