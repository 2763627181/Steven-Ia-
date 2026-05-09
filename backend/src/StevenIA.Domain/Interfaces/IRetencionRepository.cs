using StevenIA.Domain.Entities;

namespace StevenIA.Domain.Interfaces;

public interface IRetencionRepository
{
    Task<IEnumerable<Retencion>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default);
    Task<Retencion?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Guid> CrearAsync(Retencion retencion, CancellationToken ct = default);
    Task ActualizarAsync(Retencion retencion, CancellationToken ct = default);
}
