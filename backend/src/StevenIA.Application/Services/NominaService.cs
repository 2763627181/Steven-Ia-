using StevenIA.Application.DTOs;
using StevenIA.Domain.Common;
using StevenIA.Domain.Interfaces;
using StevenIA.Domain.Rules;

namespace StevenIA.Application.Services;

public class NominaService(IEmpleadoRepository repo)
{
    public CalcularNominaResponse Calcular(CalcularNominaRequest req)
    {
        var r = MotorNomina.Calcular(req.SalarioBruto);
        return MapResponse(r);
    }

    public async Task<List<EmpleadoNominaDto>> NominaEmpresaAsync(Guid empresaId, CancellationToken ct = default)
    {
        var empleados = await repo.ListarPorEmpresaAsync(empresaId, ct);

        return empleados.Where(e => e.Activo).Select(emp =>
        {
            var r = MotorNomina.Calcular(emp.SalarioBruto);
            var alertas = r.Alertas.Select(a => a.Mensaje).ToList();

            // Alerta si no tiene cedula
            if (string.IsNullOrWhiteSpace(emp.Cedula))
                alertas.Add("Sin cédula registrada. Requerida para TSS.");

            return new EmpleadoNominaDto(
                emp.Id, emp.Nombre, emp.Cedula, emp.Cargo, emp.Area,
                r.SalarioBruto,
                r.Tss.SfsEmpleado, r.Tss.VdsEmpleado, r.Tss.RlEmpleado, r.Tss.TotalEmpleado,
                r.Isr.IsrMensual,
                r.SalarioNeto,
                r.CostoTotalEmpleador,
                emp.Activo ? "Activo" : "Inactivo",
                alertas);
        }).ToList();
    }

    private static CalcularNominaResponse MapResponse(MotorNomina.ResultadoNomina r) =>
        new(r.SalarioBruto,
            new TssDto(
                r.Tss.SfsEmpleado, r.Tss.VdsEmpleado, r.Tss.RlEmpleado, r.Tss.TotalEmpleado,
                r.Tss.SfsEmpleador, r.Tss.VdsEmpleador, r.Tss.RlEmpleador, r.Tss.TotalEmpleador),
            new IsrDto(
                r.Isr.BaseImponibleAnual, r.Isr.IsrAnual, r.Isr.IsrMensual, r.Isr.TramoAplicado),
            r.TotalDescuentosEmpleado,
            r.SalarioNeto,
            r.CostoTotalEmpleador,
            r.Alertas.Select(a => new AlertaDto(a.Codigo, a.Mensaje, a.Nivel.ToString(), a.Accion)).ToList());
}
