using StevenIA.Domain.Common;

namespace StevenIA.Domain.Rules;

/// <summary>
/// Motor de reglas fiscales para República Dominicana.
/// Valida NCF, detecta riesgos y calcula ITBIS según Ley 11-92 y normas DGII.
/// NUNCA inventa resultados — cualquier ambigüedad se reporta como alerta, no como cálculo.
/// </summary>
public static class MotorFiscal
{
    // Tipos NCF válidos según DGII (Norma 06-18 y emisión electrónica)
    private static readonly Dictionary<string, string> TiposNcf = new()
    {
        ["B01"] = "Crédito Fiscal",
        ["B02"] = "Consumo",
        ["B14"] = "Régimen especial tributación simplificada",
        ["B15"] = "Gubernamentales",
        ["B16"] = "Exportaciones",
        ["B17"] = "Para pagos al exterior",
        ["E31"] = "Factura de crédito fiscal electrónica",
        ["E32"] = "Factura de consumo electrónica",
        ["E33"] = "Nota de débito electrónica",
        ["E34"] = "Nota de crédito electrónica",
        ["E41"] = "Compra electrónica",
        ["E43"] = "Gastos menores electrónico",
        ["E44"] = "Regímenes especiales electrónico",
        ["E45"] = "Gubernamentales electrónico",
    };

    // Conceptos exentos de ITBIS (Art. 343-344 Ley 11-92)
    private static readonly HashSet<string> ConceptosExentosItbis =
    [
        "alimentos básicos", "medicamentos", "servicios educativos",
        "servicios de salud", "libros", "exportaciones",
        "seguros", "energía eléctrica residencial",
    ];

    public record ResultadoNcf(
        bool Valido,
        string? TipoDescripcion,
        string? CodigoTipo,
        bool EsElectronico,
        bool Credito,   // ¿genera crédito fiscal?
        List<Alerta> Alertas
    );

    public record ResultadoItbis(
        bool Aplica,
        decimal Tasa,           // 0.18 si aplica, 0 si exento
        decimal MontoItbis,
        List<Alerta> Alertas
    );

    public record AnalisisFiscal(
        ResultadoNcf Ncf,
        ResultadoItbis Itbis,
        string NivelRiesgo,     // Bajo | Medio | Alto | Crítico
        List<Alerta> TodasLasAlertas
    );

    // ── Punto de entrada principal ────────────────────────────────────
    public static AnalisisFiscal Analizar(string ncf, string? concepto, decimal monto, decimal itbisDeclarado)
    {
        var alertas = new List<Alerta>();

        var resultadoNcf  = ValidarNcf(ncf, alertas);
        var resultadoItbis = AnalizarItbis(ncf, concepto, monto, itbisDeclarado, alertas);

        var riesgo = DeterminarRiesgo(resultadoNcf, resultadoItbis, alertas);

        return new AnalisisFiscal(resultadoNcf, resultadoItbis, riesgo, alertas);
    }

    // ── Validación NCF ────────────────────────────────────────────────
    public static ResultadoNcf ValidarNcf(string ncf, List<Alerta>? alertasExternas = null)
    {
        var alertas = alertasExternas ?? [];
        ncf = ncf.Trim().ToUpperInvariant();

        if (string.IsNullOrWhiteSpace(ncf))
        {
            alertas.Add(new Alerta("NCF-001", "NCF vacío o nulo.", NivelAlerta.Critico));
            return new ResultadoNcf(false, null, null, false, false, alertas);
        }

        // Detectar prefijo (B o E)
        string? codigoTipo = null;
        bool esElectronico = ncf.StartsWith('E');

        // Buscar código de tipo (3 caracteres: B01, E31, etc.)
        if (ncf.Length >= 3)
            codigoTipo = ncf[..3];

        if (codigoTipo == null || !TiposNcf.ContainsKey(codigoTipo))
        {
            alertas.Add(new Alerta("NCF-002",
                $"Tipo de NCF '{codigoTipo ?? "?"}' no reconocido por DGII. Tipos válidos: B01, B02, B14, B15, E31-E45.",
                NivelAlerta.Critico));
            return new ResultadoNcf(false, null, codigoTipo, esElectronico, false, alertas);
        }

        // Validar longitud: B = 11 dígitos después del tipo (13 total), E = 13 total
        int longitudEsperada = esElectronico ? 13 : 13; // ambos son 13 con el prefijo
        if (ncf.Length != longitudEsperada)
        {
            alertas.Add(new Alerta("NCF-003",
                $"Longitud inválida: {ncf.Length} caracteres. Se esperan {longitudEsperada}.",
                NivelAlerta.Critico));
        }

        // Validar que la parte numérica sea solo dígitos
        string parteNumerica = ncf[3..];
        if (!parteNumerica.All(char.IsDigit))
        {
            alertas.Add(new Alerta("NCF-004",
                "La parte numérica del NCF contiene caracteres no numéricos.",
                NivelAlerta.Critico));
        }

        // NCF en cero (inválido)
        if (parteNumerica.All(c => c == '0'))
        {
            alertas.Add(new Alerta("NCF-005", "NCF con secuencia en cero no es válido.", NivelAlerta.Critico));
        }

        bool valido = !alertas.Any(a => a.Nivel == NivelAlerta.Critico);
        bool generaCredito = codigoTipo is "B01" or "E31";
        string descripcion = TiposNcf[codigoTipo];

        if (valido && !generaCredito && codigoTipo == "B02")
            alertas.Add(new Alerta("NCF-006",
                "Comprobante de consumo (B02). No genera crédito fiscal para el comprador.",
                NivelAlerta.Info));

        return new ResultadoNcf(valido, descripcion, codigoTipo, esElectronico, generaCredito, alertas);
    }

    // ── Análisis ITBIS ────────────────────────────────────────────────
    public static ResultadoItbis AnalizarItbis(
        string ncf, string? concepto, decimal monto, decimal itbisDeclarado,
        List<Alerta>? alertasExternas = null)
    {
        var alertas = alertasExternas ?? [];
        const decimal tasaItbis = 0.18m;

        // B15 y B16 (gubernamentales y exportaciones) están exentos de ITBIS
        string prefijo = ncf.Length >= 3 ? ncf[..3].ToUpperInvariant() : "";
        if (prefijo is "B15" or "E45")
        {
            return new ResultadoItbis(false, 0, 0, alertas);
        }
        if (prefijo == "B16")
        {
            return new ResultadoItbis(false, 0, 0, alertas);
        }

        // Verificar si el concepto sugiere exención
        bool conceptoExento = concepto != null &&
            ConceptosExentosItbis.Any(e => concepto.Contains(e, StringComparison.OrdinalIgnoreCase));

        if (conceptoExento)
        {
            if (itbisDeclarado > 0)
                alertas.Add(new Alerta("ITBIS-001",
                    "Se declaró ITBIS en un concepto que puede ser exento. Verificar aplicabilidad.",
                    NivelAlerta.Advertencia));
            return new ResultadoItbis(false, 0, 0, alertas);
        }

        // Calcular ITBIS esperado
        decimal montoSinItbis = monto / (1 + tasaItbis);
        decimal itbisEsperado = Math.Round(monto - montoSinItbis, 2);

        // Comparar contra lo declarado (tolerancia ±RD$5 por redondeo)
        if (itbisDeclarado > 0)
        {
            decimal diferencia = Math.Abs(itbisEsperado - itbisDeclarado);
            if (diferencia > 5)
                alertas.Add(new Alerta("ITBIS-002",
                    $"ITBIS declarado RD${itbisDeclarado:N2} difiere del calculado RD${itbisEsperado:N2} (diferencia RD${diferencia:N2}).",
                    NivelAlerta.Advertencia,
                    "Verificar cálculo con proveedor"));
        }
        else
        {
            alertas.Add(new Alerta("ITBIS-003",
                $"No se declaró ITBIS. ITBIS estimado: RD${itbisEsperado:N2} (18% sobre base).",
                NivelAlerta.Advertencia,
                "Solicitar NCF con ITBIS o confirmar exención"));
        }

        return new ResultadoItbis(true, tasaItbis, itbisDeclarado > 0 ? itbisDeclarado : itbisEsperado, alertas);
    }

    // ── Determinación de nivel de riesgo ─────────────────────────────
    private static string DeterminarRiesgo(ResultadoNcf ncf, ResultadoItbis itbis, List<Alerta> alertas)
    {
        if (!ncf.Valido) return "Crítico";
        if (alertas.Any(a => a.Nivel == NivelAlerta.Critico)) return "Crítico";
        if (alertas.Any(a => a.Nivel == NivelAlerta.Advertencia)) return "Medio";
        return "Bajo";
    }
}
