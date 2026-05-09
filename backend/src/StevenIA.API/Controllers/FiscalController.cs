using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StevenIA.Application.DTOs;
using StevenIA.Application.Services;
using System.Security.Claims;

namespace StevenIA.API.Controllers;

[ApiController]
[Route("api/fiscal")]
[Authorize]
public class FiscalController(FiscalService service) : ControllerBase
{
    private Guid EmpresaId => Guid.Parse(
        User.FindFirstValue("empresa_id") ?? throw new UnauthorizedAccessException("empresa_id ausente en token"));

    /// <summary>Listar todas las facturas de la empresa</summary>
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken ct) =>
        Ok(await service.ListarAsync(EmpresaId, ct));

    /// <summary>Analizar un NCF puntual sin persistir</summary>
    [HttpPost("analizar-ncf")]
    public IActionResult AnalizarNcf([FromBody] AnalizarNcfRequest req) =>
        Ok(service.AnalizarNcf(req));

    /// <summary>Registrar factura y ejecutar análisis fiscal completo</summary>
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearFacturaRequest req, CancellationToken ct) =>
        Ok(await service.CrearYAnalizarAsync(EmpresaId, req, ct));
}
