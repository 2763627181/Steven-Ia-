namespace StevenIA.Domain.Entities;

public class Empleado
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nombre { get; set; } = "";
    public string? Cedula { get; set; }
    public string? Cargo { get; set; }
    public string? Area { get; set; }
    public decimal SalarioBruto { get; set; }
    public string? TipoContrato { get; set; }
    public DateOnly? FechaIngreso { get; set; }
    public bool Activo { get; set; } = true;
}
