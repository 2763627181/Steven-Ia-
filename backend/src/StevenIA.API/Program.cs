using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StevenIA.API.Middleware;
using StevenIA.Application.Services;
using StevenIA.Domain.Interfaces;
using StevenIA.Infrastructure.Data;
using StevenIA.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Configuración ─────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("Supabase")
    ?? throw new InvalidOperationException("ConnectionStrings:Supabase no configurada.");

var supabaseJwtSecret = builder.Configuration["Supabase:JwtSecret"]
    ?? throw new InvalidOperationException("Supabase:JwtSecret no configurada.");

// ── Servicios ─────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Steven IA API", Version = "v1",
        Description = "Motor fiscal, nómina y retenciones — República Dominicana" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Token JWT de Supabase"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            []
        }
    });
});

// ── JWT Authentication (Supabase tokens) ─────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(supabaseJwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Supabase:Url"] + "/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddAuthorization();

// ── CORS (frontend Next.js) ───────────────────────────────────────────
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:3000"])
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── Infraestructura ───────────────────────────────────────────────────
builder.Services.AddSingleton(new DbConnectionFactory(connectionString));

// Repositories (Transient: cada request una nueva instancia via Dapper)
builder.Services.AddTransient<IFacturaRepository,  FacturaRepository>();
builder.Services.AddTransient<IEmpleadoRepository, EmpleadoRepository>();
builder.Services.AddTransient<IRetencionRepository, RetencionRepository>();

// Application Services
builder.Services.AddTransient<FiscalService>();
builder.Services.AddTransient<NominaService>();
builder.Services.AddTransient<RetencionesService>();

// ── App ───────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Steven IA API v1"));
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
