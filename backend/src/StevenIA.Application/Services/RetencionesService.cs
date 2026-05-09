using StevenIA.Application.DTOs;
using StevenIA.Domain.Common;
using StevenIA.Domain.Entities;
using StevenIA.Domain.Interfaces;
using StevenIA.Domain.Rules;

namespace StevenIA.Application.Services;

public class RetencionesService(IRetencionRepository repo)
{
    public async Task<List<RetencionDto>> ListarAsync(Guid empresaId, CancellationToken ct = default)
    {
        var lista = await repo.ListarPorEmpresaAsync(empresaId, ct);
        return lista.Select(MapDto).ToList();
    }

    public AnalizarRetencionResponse Analizar(AnalizarRetencionRequest req)
    {
        var tipo = req.TipoPersona.ToLowerInvariant() == "juridica"
            ? MotorRetenciones.TipoPersona.Juridica
            : MotorRetenciones.TipoPersona.Fisica;

        var r = MotorRetenciones.Analizar(
            tipo, req.Concepto, req.MontoPago, req.ItbisFactura,
            req.EsGranContribuyente, req.EsDividendo);

        return new AnalizarRetencionResponse(
            r.AplicaIsr, r.TasaIsr, r.MontoIsr,
            r.AplicaItbis, r.TasaItbis, r.MontoItbis,
            r.TotalRetencion, r.Clasificacion, r.NivelRiesgo,
            r.Alertas.Select(a => new AlertaDto(a.Codigo, a.Mensaje, a.Nivel.ToString(), a.Accion)).ToList());
    }

    public async Task<AnalizarRetencionResponse> CrearYAnalizarAsync(
        Guid empresaId, CrearRetencionRequest req, CancellationToken ct = default)
    {
        var analisisReq = new AnalizarRetencionRequest(
            req.TipoPersona, req.Concepto, req.Monto, req.ItbisFactura);
        var analisis = Analizar(analisisReq);

        var retencion = new Retencion
        {
            Id              = Guid.NewGuid(),
            EmpresaId       = empresaId,
            Proveedor       = req.Proveedor,
            Rnc             = req.Rnc,
            TipoPersona     = req.TipoPersona,
            Concepto        = req.Concepto,
            Factura         = req.Factura,
            Monto           = req.Monto,
            TasaSugerida    = analisis.TasaIsr * 100m,
            MontoRetencion  = analisis.MontoIsr,
            Estado          = analisis.AplicaIsr ? "Pendiente" : "Sin retención",
            Riesgo          = analisis.NivelRiesgo,
            Alerta          = analisis.Alertas.FirstOrDefault(a => a.Nivel == "Advertencia" || a.Nivel == "Critico")?.Mensaje,
            Fecha           = req.Fecha != null ? DateOnly.Parse(req.Fecha) : null,
        };

        await repo.CrearAsync(retencion, ct);
        return analisis;
    }

    private static RetencionDto MapDto(Retencion r) => new(
        r.Id, r.Proveedor, r.Rnc, r.TipoPersona, r.Concepto, r.Factura,
        r.Monto, r.TasaSugerida, r.MontoRetencion, r.Estado, r.Riesgo, r.Alerta,
        r.Fecha?.ToString("yyyy-MM-dd"));
}
