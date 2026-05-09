namespace StevenIA.Domain.Entities;

public class Factura
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Ncf { get; set; } = "";
    public string Proveedor { get; set; } = "";
    public string? RncProveedor { get; set; }
    public string? TipoNcf { get; set; }
    public string? Concepto { get; set; }
    public decimal Monto { get; set; }
    public decimal Itbis { get; set; }
    public DateOnly? Fecha { get; set; }
    public string Estado { get; set; } = "Pendiente";
    public string Riesgo { get; set; } = "Bajo";
    public string? Alerta { get; set; }
}
