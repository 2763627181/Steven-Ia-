namespace StevenIA.Domain.Entities;

public class Retencion
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Proveedor { get; set; } = "";
    public string? Rnc { get; set; }
    public string TipoPersona { get; set; } = "Física"; // Física | Jurídica
    public string? Concepto { get; set; }
    public string? Factura { get; set; }
    public decimal Monto { get; set; }
    public decimal TasaSugerida { get; set; }
    public decimal MontoRetencion { get; set; }
    public string Estado { get; set; } = "Pendiente";
    public string Riesgo { get; set; } = "Bajo";
    public string? Alerta { get; set; }
    public DateOnly? Fecha { get; set; }
}
