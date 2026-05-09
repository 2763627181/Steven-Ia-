namespace StevenIA.Application.DTOs;

public record AnalizarNcfRequest(string Ncf, string? Concepto, decimal Monto, decimal ItbisDeclarado);

public record AnalizarNcfResponse(
    bool NcfValido,
    string? TipoNcf,
    string? DescripcionTipo,
    bool EsElectronico,
    bool GeneraCredito,
    bool ItbisAplica,
    decimal TasaItbis,
    decimal MontoItbis,
    string NivelRiesgo,
    List<AlertaDto> Alertas
);

public record FacturaDto(
    Guid Id,
    string Ncf,
    string Proveedor,
    string? RncProveedor,
    string? TipoNcf,
    string? Concepto,
    decimal Monto,
    decimal Itbis,
    string? Fecha,
    string Estado,
    string Riesgo,
    string? Alerta
);

public record CrearFacturaRequest(
    string Ncf,
    string Proveedor,
    string? RncProveedor,
    string? Concepto,
    decimal Monto,
    decimal ItbisDeclarado,
    string? Fecha
);

public record AlertaDto(string Codigo, string Mensaje, string Nivel, string? Accion);
