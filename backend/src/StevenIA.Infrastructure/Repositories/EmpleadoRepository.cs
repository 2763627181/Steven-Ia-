using Dapper;
using StevenIA.Domain.Entities;
using StevenIA.Domain.Interfaces;
using StevenIA.Infrastructure.Data;

namespace StevenIA.Infrastructure.Repositories;

public class EmpleadoRepository(DbConnectionFactory db) : IEmpleadoRepository
{
    public async Task<IEnumerable<Empleado>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QueryAsync<Empleado>(
            """
            SELECT id, empresa_id AS EmpresaId, nombre, cedula, cargo, area,
                   salario_bruto AS SalarioBruto, tipo_contrato AS TipoContrato,
                   fecha_ingreso AS FechaIngreso, activo
            FROM empleados
            WHERE empresa_id = @EmpresaId AND activo = true
            ORDER BY nombre
            """,
            new { EmpresaId = empresaId });
    }

    public async Task<Empleado?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        using var conn = db.Create();
        return await conn.QuerySingleOrDefaultAsync<Empleado>(
            """
            SELECT id, empresa_id AS EmpresaId, nombre, cedula, cargo, area,
                   salario_bruto AS SalarioBruto, tipo_contrato AS TipoContrato,
                   fecha_ingreso AS FechaIngreso, activo
            FROM empleados
            WHERE id = @Id
            """,
            new { Id = id });
    }

    public async Task<Guid> CrearAsync(Empleado e, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            INSERT INTO empleados
              (id, empresa_id, nombre, cedula, cargo, area,
               salario_bruto, tipo_contrato, fecha_ingreso, activo)
            VALUES
              (@Id, @EmpresaId, @Nombre, @Cedula, @Cargo, @Area,
               @SalarioBruto, @TipoContrato,
               @FechaIngreso, @Activo)
            """,
            new {
                e.Id, e.EmpresaId, e.Nombre, e.Cedula, e.Cargo, e.Area,
                e.SalarioBruto, e.TipoContrato,
                FechaIngreso = e.FechaIngreso?.ToString("yyyy-MM-dd"),
                e.Activo
            });
        return e.Id;
    }

    public async Task ActualizarAsync(Empleado e, CancellationToken ct = default)
    {
        using var conn = db.Create();
        await conn.ExecuteAsync(
            """
            UPDATE empleados
            SET nombre = @Nombre, cargo = @Cargo, area = @Area,
                salario_bruto = @SalarioBruto, activo = @Activo
            WHERE id = @Id AND empresa_id = @EmpresaId
            """,
            new { e.Id, e.EmpresaId, e.Nombre, e.Cargo, e.Area, e.SalarioBruto, e.Activo });
    }
}
