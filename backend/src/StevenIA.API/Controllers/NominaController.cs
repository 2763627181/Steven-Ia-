using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StevenIA.Application.DTOs;
using StevenIA.Application.Services;
using System.Security.Claims;

namespace StevenIA.API.Controllers;

[ApiController]
[Route("api/nomina")]
[Authorize]
public class NominaController(NominaService service) : ControllerBase
{
    private Guid EmpresaId => Guid.Parse(
        User.FindFirstValue("empresa_id") ?? throw new UnauthorizedAccessException("empresa_id ausente en token"));

    /// <summary>Calcular TSS + ISR para un salario puntual</summary>
    [HttpPost("calcular")]
    [AllowAnonymous] // Endpoint público para demo / calculadora
    public IActionResult Calcular([FromBody] CalcularNominaRequest req) =>
        Ok(service.Calcular(req));

    /// <summary>Nómina completa de todos los empleados de la empresa</summary>
    [HttpGet]
    public async Task<IActionResult> NominaEmpresa(CancellationToken ct) =>
        Ok(await service.NominaEmpresaAsync(EmpresaId, ct));
}
