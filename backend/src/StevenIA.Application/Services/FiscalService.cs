using StevenIA.Application.DTOs;
using StevenIA.Domain.Common;
using StevenIA.Domain.Entities;
using StevenIA.Domain.Interfaces;
using StevenIA.Domain.Rules;

namespace StevenIA.Application.Services;

public class FiscalService(IFacturaRepository repo)
{
    public async Task<List<FacturaDto>> ListarAsync(Guid empresaId, CancellationToken ct = default)
    {
        var facturas = await repo.ListarPorEmpresaAsync(empresaId, ct);
        return facturas.Select(MapDto).ToList();
    }

    public AnalizarNcfResponse AnalizarNcf(AnalizarNcfRequest req)
    {
        var resultado = MotorFiscal.Analizar(req.Ncf, req.Concepto, req.Monto, req.ItbisDeclarado);
        return new AnalizarNcfResponse(
            resultado.Ncf.Valido,
            resultado.Ncf.CodigoTipo,
            resultado.Ncf.TipoDescripcion,
            resultado.Ncf.EsElectronico,
            resultado.Ncf.Credito,
            resultado.Itbis.Aplica,
            resultado.Itbis.Tasa,
            resultado.Itbis.MontoItbis,
            resultado.NivelRiesgo,
            resultado.TodasLasAlertas.Select(MapAlerta).ToList()
        );
    }

    public async Task<AnalizarNcfResponse> CrearYAnalizarAsync(
        Guid empresaId, CrearFacturaRequest req, CancellationToken ct = default)
    {
        var analisis = MotorFiscal.Analizar(req.Ncf, req.Concepto, req.Monto, req.ItbisDeclarado);

        var factura = new Factura
        {
            Id            = Guid.NewGuid(),
            EmpresaId     = empresaId,
            Ncf           = req.Ncf.Trim().ToUpperInvariant(),
            Proveedor     = req.Proveedor,
            RncProveedor  = req.RncProveedor,
            TipoNcf       = analisis.Ncf.CodigoTipo,
            Concepto      = req.Concepto,
            Monto         = req.Monto,
            Itbis         = req.ItbisDeclarado,
            Fecha         = req.Fecha != null ? DateOnly.Parse(req.Fecha) : null,
            Estado        = analisis.Ncf.Valido ? "Pendiente" : "Rechazado",
            Riesgo        = analisis.NivelRiesgo,
            Alerta        = analisis.TodasLasAlertas.FirstOrDefault(a => a.Nivel >= NivelAlerta.Advertencia)?.Mensaje,
        };

        await repo.CrearAsync(factura, ct);

        return new AnalizarNcfResponse(
            analisis.Ncf.Valido,
            analisis.Ncf.CodigoTipo,
            analisis.Ncf.TipoDescripcion,
            analisis.Ncf.EsElectronico,
            analisis.Ncf.Credito,
            analisis.Itbis.Aplica,
            analisis.Itbis.Tasa,
            analisis.Itbis.MontoItbis,
            analisis.NivelRiesgo,
            analisis.TodasLasAlertas.Select(MapAlerta).ToList()
        );
    }

    private static FacturaDto MapDto(Factura f) => new(
        f.Id, f.Ncf, f.Proveedor, f.RncProveedor, f.TipoNcf, f.Concepto,
        f.Monto, f.Itbis, f.Fecha?.ToString("yyyy-MM-dd"), f.Estado, f.Riesgo, f.Alerta);

    private static AlertaDto MapAlerta(Alerta a) =>
        new(a.Codigo, a.Mensaje, a.Nivel.ToString(), a.Accion);
}
