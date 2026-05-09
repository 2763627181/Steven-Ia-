namespace StevenIA.Application.DTOs;

public record AnalizarRetencionRequest(
    string TipoPersona,      // "Fisica" | "Juridica"
    string? Concepto,
    decimal MontoPago,
    decimal ItbisFactura,
    bool EsGranContribuyente = false,
    bool EsDividendo = false
);

public record AnalizarRetencionResponse(
    bool AplicaIsr,
    decimal TasaIsr,
    decimal MontoIsr,
    bool AplicaItbis,
    decimal TasaItbis,
    decimal MontoItbis,
    decimal TotalRetencion,
    string Clasificacion,
    string NivelRiesgo,
    List<AlertaDto> Alertas
);

public record RetencionDto(
    Guid Id,
    string Proveedor,
    string? Rnc,
    string TipoPersona,
    string? Concepto,
    string? Factura,
    decimal Monto,
    decimal TasaSugerida,
    decimal MontoRetencion,
    string Estado,
    string Riesgo,
    string? Alerta,
    string? Fecha
);

public record CrearRetencionRequest(
    string Proveedor,
    string? Rnc,
    string TipoPersona,
    string? Concepto,
    string? Factura,
    decimal Monto,
    decimal ItbisFactura,
    string? Fecha
);
