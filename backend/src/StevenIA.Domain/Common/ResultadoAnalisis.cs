namespace StevenIA.Domain.Common;

public record ResultadoAnalisis<T>(bool Exitoso, T? Datos, string? Error = null)
{
    public static ResultadoAnalisis<T> Ok(T datos) => new(true, datos);
    public static ResultadoAnalisis<T> Fallo(string error) => new(false, default, error);
}

public record Alerta(string Codigo, string Mensaje, NivelAlerta Nivel, string? Accion = null);

public enum NivelAlerta { Info, Advertencia, Critico }
