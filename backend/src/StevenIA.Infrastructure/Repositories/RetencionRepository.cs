using Dapper;
using StevenIA.Domain.Entities;
using StevenIA.Domain.Interfaces;
using StevenIA.Infrastructure.Data;

namespace StevenIA.Infrastructure.Repositories;

public class RetencionRepository(DbConnectionFactory db) : IRetencionRepository
{
    public async Task<IEnumerable<Retencion>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QueryAsync<Retencion>(
            """
            SELECT id, empresa_id AS EmpresaId, proveedor, rnc, tipo_persona AS TipoPersona,
                   concepto, factura, monto, tasa_sugerida AS TasaSugerida,
                   monto_retencion AS MontoRetencion, estado, riesgo, alerta, fecha
            FROM retenciones
            WHERE empresa_id = @EmpresaId
            ORDER BY fecha DESC, created_at DESC
            """,
            new { EmpresaId = empresaId });
    }

    public async Task<Retencion?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QuerySingleOrDefaultAsync<Retencion>(
            """
            SELECT id, empresa_id AS EmpresaId, proveedor, rnc, tipo_persona AS TipoPersona,
                   concepto, factura, monto, tasa_sugerida AS TasaSugerida,
                   monto_retencion AS MontoRetencion, estado, riesgo, alerta, fecha
            FROM retenciones
            WHERE id = @Id
            """,
            new { Id = id });
    }

    public async Task<Guid> CrearAsync(Retencion r, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            INSERT INTO retenciones
              (id, empresa_id, proveedor, rnc, tipo_persona, concepto, factura,
               monto, tasa_sugerida, monto_retencion, estado, riesgo, alerta, fecha)
            VALUES
              (@Id, @EmpresaId, @Proveedor, @Rnc, @TipoPersona, @Concepto, @Factura,
               @Monto, @TasaSugerida, @MontoRetencion, @Estado, @Riesgo, @Alerta,
               @Fecha)
            """,
            new {
                r.Id, r.EmpresaId, r.Proveedor, r.Rnc, r.TipoPersona, r.Concepto, r.Factura,
                r.Monto, r.TasaSugerida, r.MontoRetencion, r.Estado, r.Riesgo, r.Alerta,
                Fecha = r.Fecha?.ToString("yyyy-MM-dd")
            });
        return r.Id;
    }

    public async Task ActualizarAsync(Retencion r, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            UPDATE retenciones
            SET estado = @Estado, monto_retencion = @MontoRetencion, alerta = @Alerta
            WHERE id = @Id AND empresa_id = @EmpresaId
            """,
            new { r.Id, r.EmpresaId, r.Estado, r.MontoRetencion, r.Alerta });
    }
}
