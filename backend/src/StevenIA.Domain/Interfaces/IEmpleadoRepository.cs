using StevenIA.Domain.Entities;

namespace StevenIA.Domain.Interfaces;

public interface IEmpleadoRepository
{
    Task<IEnumerable<Empleado>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default);
    Task<Empleado?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Guid> CrearAsync(Empleado empleado, CancellationToken ct = default);
    Task ActualizarAsync(Empleado empleado, CancellationToken ct = default);
}
