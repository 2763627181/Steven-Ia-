using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StevenIA.Application.DTOs;
using StevenIA.Application.Services;
using System.Security.Claims;

namespace StevenIA.API.Controllers;

[ApiController]
[Route("api/retenciones")]
[Authorize]
public class RetencionesController(RetencionesService service) : ControllerBase
{
    private Guid EmpresaId => Guid.Parse(
        User.FindFirstValue("empresa_id") ?? throw new UnauthorizedAccessException("empresa_id ausente en token"));

    /// <summary>Listar retenciones de la empresa</summary>
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken ct) =>
        Ok(await service.ListarAsync(EmpresaId, ct));

    /// <summary>Analizar si aplica retención (sin persistir)</summary>
    [HttpPost("analizar")]
    [AllowAnonymous]
    public IActionResult Analizar([FromBody] AnalizarRetencionRequest req) =>
        Ok(service.Analizar(req));

    /// <summary>Registrar pago y calcular retención automáticamente</summary>
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearRetencionRequest req, CancellationToken ct) =>
        Ok(await service.CrearYAnalizarAsync(EmpresaId, req, ct));
}
