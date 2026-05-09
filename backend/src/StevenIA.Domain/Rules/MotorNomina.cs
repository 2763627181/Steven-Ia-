using StevenIA.Domain.Common;

namespace StevenIA.Domain.Rules;

/// <summary>
/// Motor de cálculo de nómina para República Dominicana.
/// Implementa TSS 2026 y escala ISR 2026 según Ley 87-01 (TSS) y Ley 11-92 (ISR).
/// Los topes y tasas son constantes auditables — cualquier cambio requiere actualizar
/// esta clase, no inventar valores.
/// </summary>
public static class MotorNomina
{
    // ── Tasas TSS vigentes 2026 (Ley 87-01 / TSS) ────────────────────
    // Seguro Familiar de Salud (SFS)
    private const decimal TasaSfsEmpleado   = 0.0304m;
    private const decimal TasaSfsEmpleador  = 0.0709m;
    private const decimal TopeSfs           = 232_230m;   // RD$/mes

    // Vejez, Discapacidad y Sobrevivencia / AFP (VDS)
    private const decimal TasaVdsEmpleado   = 0.0287m;
    private const decimal TasaVdsEmpleador  = 0.0710m;
    private const decimal TopeVds           = 464_460m;   // RD$/mes

    // Riesgo Laboral (RL) — solo empleador, tasa riesgo normal
    private const decimal TasaRlEmpleador   = 0.0110m;   // Riesgo normal (cat. A/B)
    private const decimal TopeRl            = 92_892m;    // RD$/mes

    // Empleado también cotiza RL en algunos convenios; típicamente es solo empleador
    private const decimal TasaRlEmpleado    = 0.005m;    // 0.5% Seguro de vida/RL empleado
    private const decimal TopeRlEmpleado    = 92_892m;

    // ── Escala ISR asalariados 2026 (Ley 11-92, Art. 296, indexed) ───
    // Fuente: DGII, valores anuales. Aplicar mensualmente = anual / 12.
    private static readonly EscalaIsrTramo[] EscalaAnual =
    [
        new(0m,          416_220m,    0m,         0.00m),
        new(416_220m,    624_329m,    0m,         0.15m),
        new(624_329m,    867_123m,    31_216.05m, 0.20m),
        new(867_123m,    decimal.MaxValue, 79_773.65m, 0.25m),
    ];

    private record EscalaIsrTramo(
        decimal LimiteInferior,
        decimal LimiteSuperior,
        decimal CuotaFija,      // ISR acumulado de tramos anteriores
        decimal Tasa
    );

    // ── DTOs de resultado ─────────────────────────────────────────────
    public record ResultadoTss(
        decimal SfsEmpleado,
        decimal VdsEmpleado,
        decimal RlEmpleado,
        decimal TotalEmpleado,
        decimal SfsEmpleador,
        decimal VdsEmpleador,
        decimal RlEmpleador,
        decimal TotalEmpleador
    );

    public record ResultadoIsr(
        decimal BaseImponibleAnual,
        decimal IsrAnual,
        decimal IsrMensual,
        string TramoAplicado
    );

    public record ResultadoNomina(
        decimal SalarioBruto,
        ResultadoTss Tss,
        ResultadoIsr Isr,
        decimal TotalDescuentosEmpleado,
        decimal SalarioNeto,
        decimal CostoTotalEmpleador,
        List<Alerta> Alertas
    );

    // ── Punto de entrada principal ────────────────────────────────────
    public static ResultadoNomina Calcular(decimal salarioBruto)
    {
        var alertas = new List<Alerta>();

        if (salarioBruto <= 0)
        {
            alertas.Add(new Alerta("NOM-001", "Salario bruto debe ser mayor a cero.", NivelAlerta.Critico));
            return new ResultadoNomina(salarioBruto, new ResultadoTss(0,0,0,0,0,0,0,0),
                new ResultadoIsr(0,0,0,"N/A"), 0, 0, 0, alertas);
        }

        // 1. TSS empleado
        var tss = CalcularTss(salarioBruto);

        // 2. ISR: base imponible = salario bruto - TSS empleado (las cotizaciones son deducibles)
        decimal baseImponibleMensual = salarioBruto - tss.TotalEmpleado;
        var isr = CalcularIsr(baseImponibleMensual);

        // 3. Totales
        decimal descuentosEmpleado = tss.TotalEmpleado + isr.IsrMensual;
        decimal salarioNeto        = salarioBruto - descuentosEmpleado;
        decimal costoEmpleador     = salarioBruto + tss.TotalEmpleador;

        // 4. Alertas de salario mínimo (salario mínimo nacional ~RD$14,000 en 2026)
        if (salarioBruto < 14_000m)
            alertas.Add(new Alerta("NOM-002",
                $"Salario RD${salarioBruto:N0} está por debajo del salario mínimo nacional estimado RD$14,000.",
                NivelAlerta.Advertencia,
                "Verificar cumplimiento Código de Trabajo Art. 198"));

        return new ResultadoNomina(
            salarioBruto, tss, isr, descuentosEmpleado, salarioNeto, costoEmpleador, alertas);
    }

    // ── TSS ───────────────────────────────────────────────────────────
    public static ResultadoTss CalcularTss(decimal salarioBruto)
    {
        decimal baseSfs = Math.Min(salarioBruto, TopeSfs);
        decimal baseVds = Math.Min(salarioBruto, TopeVds);
        decimal baseRlE = Math.Min(salarioBruto, TopeRlEmpleado);
        decimal baseRlR = Math.Min(salarioBruto, TopeRl);

        decimal sfsEmp  = Redondear(baseSfs * TasaSfsEmpleado);
        decimal vdsEmp  = Redondear(baseVds * TasaVdsEmpleado);
        decimal rlEmp   = Redondear(baseRlE * TasaRlEmpleado);

        decimal sfsEmpr = Redondear(baseSfs * TasaSfsEmpleador);
        decimal vdsEmpr = Redondear(baseVds * TasaVdsEmpleador);
        decimal rlEmpr  = Redondear(baseRlR * TasaRlEmpleador);

        return new ResultadoTss(
            sfsEmp, vdsEmp, rlEmp, sfsEmp + vdsEmp + rlEmp,
            sfsEmpr, vdsEmpr, rlEmpr, sfsEmpr + vdsEmpr + rlEmpr);
    }

    // ── ISR ───────────────────────────────────────────────────────────
    public static ResultadoIsr CalcularIsr(decimal salarioNetoMensual)
    {
        // Anualizar para aplicar la escala
        decimal baseAnual = salarioNetoMensual * 12m;

        decimal isrAnual = 0m;
        string tramo = "Tramo 1 — Exento";

        foreach (var t in EscalaAnual)
        {
            if (baseAnual <= t.LimiteInferior) break;
            if (t.Tasa == 0m) continue;

            decimal limSup = Math.Min(baseAnual, t.LimiteSuperior);
            decimal excedente = limSup - t.LimiteInferior;
            isrAnual = t.CuotaFija + excedente * t.Tasa;
            tramo = $"Tramo {Array.IndexOf(EscalaAnual, t) + 1} — {t.Tasa:P0} s/excedente de RD${t.LimiteInferior:N0}";
        }

        decimal isrMensual = Redondear(isrAnual / 12m);
        return new ResultadoIsr(baseAnual, Redondear(isrAnual), isrMensual, tramo);
    }

    private static decimal Redondear(decimal valor) => Math.Round(valor, 2, MidpointRounding.AwayFromZero);
}
