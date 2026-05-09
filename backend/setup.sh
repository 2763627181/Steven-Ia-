#!/usr/bin/env bash
# Steven IA — Backend setup
# Ejecutar una vez cuando tengas .NET 9 SDK instalado.
# https://dotnet.microsoft.com/download

set -e

echo "=== Steven IA Backend Setup ==="

# Verificar .NET 9
if ! command -v dotnet &>/dev/null; then
  echo "ERROR: .NET SDK no encontrado. Instala desde https://dotnet.microsoft.com/download"
  exit 1
fi

DOTNET_VER=$(dotnet --version | cut -d'.' -f1)
if [ "$DOTNET_VER" -lt 9 ]; then
  echo "ERROR: Se requiere .NET 9 o superior (actual: $(dotnet --version))"
  exit 1
fi

echo "✓ .NET $(dotnet --version) detectado"

# Restaurar dependencias
echo ""
echo "→ Restaurando paquetes NuGet..."
dotnet restore StevenIA.sln

# Build
echo ""
echo "→ Compilando solución..."
dotnet build StevenIA.sln --configuration Release --no-restore

echo ""
echo "✓ Build exitoso."
echo ""
echo "Para iniciar la API en desarrollo:"
echo "  cd src/StevenIA.API"
echo "  dotnet run"
echo ""
echo "Swagger disponible en: http://localhost:5000/swagger"
echo ""
echo "⚠ Antes de ejecutar, configura appsettings.Development.json con:"
echo "  - ConnectionStrings:Supabase  (string de conexión PostgreSQL de Supabase)"
echo "  - Supabase:JwtSecret          (JWT secret de tu proyecto Supabase)"
echo "  - Supabase:Url                (URL de tu proyecto Supabase)"
