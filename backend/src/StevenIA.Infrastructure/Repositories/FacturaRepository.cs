using Dapper;
using StevenIA.Domain.Entities;
using StevenIA.Domain.Interfaces;
using StevenIA.Infrastructure.Data;

namespace StevenIA.Infrastructure.Repositories;

public class FacturaRepository(DbConnectionFactory db) : IFacturaRepository
{
    public async Task<IEnumerable<Factura>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QueryAsync<Factura>(
            """
            SELECT id, empresa_id AS EmpresaId, ncf, proveedor, rnc_proveedor AS RncProveedor,
                   tipo_ncf AS TipoNcf, concepto, monto, itbis, fecha, estado, riesgo, alerta
            FROM facturas
            WHERE empresa_id = @EmpresaId
            ORDER BY fecha DESC, created_at DESC
            """,
            new { EmpresaId = empresaId });
    }

    public async Task<Factura?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QuerySingleOrDefaultAsync<Factura>(
            """
            SELECT id, empresa_id AS EmpresaId, ncf, proveedor, rnc_proveedor AS RncProveedor,
                   tipo_ncf AS TipoNcf, concepto, monto, itbis, fecha, estado, riesgo, alerta
            FROM facturas
            WHERE id = @Id
            """,
            new { Id = id });
    }

    public async Task<Guid> CrearAsync(Factura f, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            INSERT INTO facturas
              (id, empresa_id, ncf, proveedor, rnc_proveedor, tipo_ncf,
               concepto, monto, itbis, fecha, estado, riesgo, alerta)
            VALUES
              (@Id, @EmpresaId, @Ncf, @Proveedor, @RncProveedor, @TipoNcf,
               @Concepto, @Monto, @Itbis, @Fecha, @Estado, @Riesgo, @Alerta)
            """,
            new {
                f.Id, f.EmpresaId, f.Ncf, f.Proveedor, f.RncProveedor, f.TipoNcf,
                f.Concepto, f.Monto, f.Itbis, Fecha = f.Fecha?.ToString("yyyy-MM-dd"),
                f.Estado, f.Riesgo, f.Alerta
            });
        return f.Id;
    }

    public async Task ActualizarAsync(Factura f, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            UPDATE facturas
            SET estado = @Estado, riesgo = @Riesgo, alerta = @Alerta
            WHERE id = @Id AND empresa_id = @EmpresaId
            """,
            new { f.Id, f.EmpresaId, f.Estado, f.Riesgo, f.Alerta });
    }
}
