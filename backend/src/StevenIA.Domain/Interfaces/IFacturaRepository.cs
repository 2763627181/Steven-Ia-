using StevenIA.Domain.Entities;

namespace StevenIA.Domain.Interfaces;

public interface IFacturaRepository
{
    Task<IEnumerable<Factura>> ListarPorEmpresaAsync(Guid empresaId, CancellationToken ct = default);
    Task<Factura?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Guid> CrearAsync(Factura factura, CancellationToken ct = default);
    Task ActualizarAsync(Factura factura, CancellationToken ct = default);
}
