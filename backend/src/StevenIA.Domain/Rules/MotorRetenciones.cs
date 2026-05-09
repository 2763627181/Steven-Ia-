using StevenIA.Domain.Common;

namespace StevenIA.Domain.Rules;

/// <summary>
/// Motor de reglas de retenciones ISR/ITBIS para República Dominicana.
/// Aplica Ley 11-92 Art. 309 (retención en la fuente) y Normas DGII vigentes 2026.
/// La retención es una obligación del pagador — el motor determina si aplica y en qué tasa.
/// </summary>
public static class MotorRetenciones
{
    // ── Tasas vigentes 2026 ───────────────────────────────────────────
    private const decimal TasaIsrPersonaFisica    = 0.10m;  // Art. 309 — honorarios, alquileres, comisiones
    private const decimal TasaIsrDividendos       = 0.10m;  // Art. 308
    private const decimal TasaItbisRetencion      = 0.30m;  // 30% del ITBIS para grandes contribuyentes
    private const decimal TasaItbisServicioPubl   = 1.00m;  // 100% para servicios del Estado

    // Tipos de servicio que generan retención ISR en persona física
    private static readonly HashSet<string> ConceptosConRetencion =
    [
        "honorarios", "asesoría", "consultoría", "ingeniería", "arquitectura",
        "servicios legales", "servicios médicos", "contabilidad", "auditoría",
        "diseño", "alquiler", "arrendamiento", "comisiones", "agencia",
        "servicios profesionales", "servicios técnicos",
    ];

    // Conceptos que NO generan retención ISR (persona física por bienes)
    private static readonly HashSet<string> ConceptosSinRetencion =
    [
        "venta de bienes", "mercancía", "materiales", "suministros",
        "combustible", "equipos", "repuestos",
    ];

    public enum TipoPersona { Fisica, Juridica }

    public record ResultadoRetencion(
        bool AplicaIsr,
        decimal TasaIsr,
        decimal MontoIsr,
        bool AplicaItbis,
        decimal TasaItbis,
        decimal MontoItbis,
        decimal TotalRetencion,
        string Clasificacion,  // "Persona Física — Servicios Profesionales", etc.
        string NivelRiesgo,
        List<Alerta> Alertas
    );

    // ── Punto de entrada principal ────────────────────────────────────
    public static ResultadoRetencion Analizar(
        TipoPersona tipoPersona,
        string? concepto,
        decimal montoPago,
        decimal itbisFactura,
        bool esGranContribuyente = false,
        bool esDividendo = false)
    {
        var alertas = new List<Alerta>();

        if (esDividendo)
            return AnalizarDividendo(montoPago, alertas);

        return tipoPersona switch
        {
            TipoPersona.Fisica    => AnalizarPersonaFisica(concepto, montoPago, itbisFactura, esGranContribuyente, alertas),
            TipoPersona.Juridica  => AnalizarPersonaJuridica(concepto, montoPago, itbisFactura, esGranContribuyente, alertas),
            _ => throw new ArgumentOutOfRangeException(nameof(tipoPersona))
        };
    }

    // ── Persona física ────────────────────────────────────────────────
    private static ResultadoRetencion AnalizarPersonaFisica(
        string? concepto, decimal monto, decimal itbisFactura,
        bool esGranContribuyente, List<Alerta> alertas)
    {
        bool tieneConcepto = !string.IsNullOrWhiteSpace(concepto);
        bool conceptoSinRetencion = tieneConcepto &&
            ConceptosSinRetencion.Any(c => concepto!.Contains(c, StringComparison.OrdinalIgnoreCase));

        bool conceptoConRetencion = tieneConcepto &&
            ConceptosConRetencion.Any(c => concepto!.Contains(c, StringComparison.OrdinalIgnoreCase));

        bool aplicaIsr;
        string clasificacion;

        if (conceptoSinRetencion)
        {
            aplicaIsr = false;
            clasificacion = "Persona Física — Venta de bienes (sin retención)";
            alertas.Add(new Alerta("RET-001",
                "El concepto indica venta de bienes. Persona física vendedora de bienes no aplica retención ISR.",
                NivelAlerta.Info));
        }
        else if (conceptoConRetencion)
        {
            aplicaIsr = true;
            clasificacion = $"Persona Física — Servicios profesionales (retención 10%)";
        }
        else
        {
            // Sin concepto claro: alerta pero aplicar retención preventivamente
            aplicaIsr = true;
            clasificacion = "Persona Física — Concepto no determinado";
            alertas.Add(new Alerta("RET-002",
                "El concepto del pago no es suficientemente claro para determinar con certeza la retención. " +
                "Se aplica retención preventiva del 10% según Art. 309 Ley 11-92.",
                NivelAlerta.Advertencia,
                "Solicitar descripción detallada del servicio al proveedor"));
        }

        decimal montoIsr  = aplicaIsr ? Math.Round(monto * TasaIsrPersonaFisica, 2) : 0m;
        decimal montoItbis = AnalizarItbisRetencion(itbisFactura, esGranContribuyente, alertas);

        decimal totalRetencion = montoIsr + montoItbis;

        if (monto > 100_000m && aplicaIsr)
            alertas.Add(new Alerta("RET-003",
                $"Pago elevado a persona física (RD${monto:N0}). Verificar si supera el umbral de declaración jurada.",
                NivelAlerta.Advertencia));

        string riesgo = DeterminarRiesgo(aplicaIsr, montoIsr, alertas);

        return new ResultadoRetencion(
            aplicaIsr, aplicaIsr ? TasaIsrPersonaFisica : 0m, montoIsr,
            montoItbis > 0, montoItbis > 0 ? TasaItbisRetencion : 0m, montoItbis,
            totalRetencion, clasificacion, riesgo, alertas);
    }

    // ── Persona jurídica ──────────────────────────────────────────────
    private static ResultadoRetencion AnalizarPersonaJuridica(
        string? concepto, decimal monto, decimal itbisFactura,
        bool esGranContribuyente, List<Alerta> alertas)
    {
        // Personas jurídicas generalmente no tienen retención ISR (pagan ISR directo)
        alertas.Add(new Alerta("RET-010",
            "Persona jurídica: no aplica retención ISR según Art. 309 Ley 11-92. " +
            "La empresa paga ISR directamente mediante declaración.",
            NivelAlerta.Info));

        decimal montoItbis = AnalizarItbisRetencion(itbisFactura, esGranContribuyente, alertas);

        return new ResultadoRetencion(
            false, 0m, 0m,
            montoItbis > 0, montoItbis > 0 ? TasaItbisRetencion : 0m, montoItbis,
            montoItbis,
            "Persona Jurídica — Sin retención ISR",
            "Bajo", alertas);
    }

    // ── Dividendos ────────────────────────────────────────────────────
    private static ResultadoRetencion AnalizarDividendo(decimal monto, List<Alerta> alertas)
    {
        decimal montoIsr = Math.Round(monto * TasaIsrDividendos, 2);
        alertas.Add(new Alerta("RET-020",
            $"Distribución de dividendos aplica retención del 10% según Art. 308 Ley 11-92. " +
            $"Retención: RD${montoIsr:N2}.",
            NivelAlerta.Info));

        return new ResultadoRetencion(
            true, TasaIsrDividendos, montoIsr,
            false, 0m, 0m,
            montoIsr,
            "Dividendos — Retención 10%",
            "Bajo", alertas);
    }

    // ── ITBIS retención (grandes contribuyentes) ──────────────────────
    private static decimal AnalizarItbisRetencion(decimal itbisFactura, bool esGranContribuyente, List<Alerta> alertas)
    {
        if (!esGranContribuyente || itbisFactura <= 0) return 0m;

        decimal retencionItbis = Math.Round(itbisFactura * TasaItbisRetencion, 2);
        alertas.Add(new Alerta("RET-030",
            $"Gran contribuyente: retener el 30% del ITBIS ({retencionItbis:N2} RD$) según Norma DGII.",
            NivelAlerta.Info));

        return retencionItbis;
    }

    private static string DeterminarRiesgo(bool aplicaIsr, decimal montoIsr, List<Alerta> alertas)
    {
        if (alertas.Any(a => a.Nivel == NivelAlerta.Critico)) return "Crítico";
        if (!aplicaIsr) return "Bajo";
        if (alertas.Any(a => a.Nivel == NivelAlerta.Advertencia)) return "Alto";
        return "Bajo";
    }
}
