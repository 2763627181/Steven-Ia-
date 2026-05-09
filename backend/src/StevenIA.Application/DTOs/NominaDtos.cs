namespace StevenIA.Application.DTOs;

public record CalcularNominaRequest(decimal SalarioBruto);

public record CalcularNominaResponse(
    decimal SalarioBruto,
    TssDto Tss,
    IsrDto Isr,
    decimal TotalDescuentosEmpleado,
    decimal SalarioNeto,
    decimal CostoTotalEmpleador,
    List<AlertaDto> Alertas
);

public record TssDto(
    decimal SfsEmpleado,
    decimal VdsEmpleado,
    decimal RlEmpleado,
    decimal TotalEmpleado,
    decimal SfsEmpleador,
    decimal VdsEmpleador,
    decimal RlEmpleador,
    decimal TotalEmpleador
);

public record IsrDto(
    decimal BaseImponibleAnual,
    decimal IsrAnual,
    decimal IsrMensual,
    string TramoAplicado
);

public record EmpleadoNominaDto(
    Guid Id,
    string Nombre,
    string? Cedula,
    string? Cargo,
    string? Area,
    decimal SalarioBruto,
    decimal SfsEmpleado,
    decimal VdsEmpleado,
    decimal RlEmpleado,
    decimal TotalTss,
    decimal IsrMensual,
    decimal SalarioNeto,
    decimal CostoEmpleador,
    string Estado,
    List<string> Alertas
);
