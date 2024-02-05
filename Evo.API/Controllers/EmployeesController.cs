using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Evo.API.Data;
using Evo.API.Models;
using System.Text.Json;

namespace Evo.API.Controllers
{
    [Route("api/departments/{departmentId}/employees")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _uploadFolder;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
            _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            Directory.CreateDirectory(_uploadFolder);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(int departmentId)
        {
            if (!await DepartmentExists(departmentId))
            {
                return NotFound($"Department with ID {departmentId} not found.");
            }

            return await _context.Employees.Where(e => e.departmentId == departmentId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int departmentId, int id)
        {
            if (!await DepartmentExists(departmentId))
            {
                return NotFound($"Department with ID {departmentId} not found.");
            }

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.departmentId == departmentId && e.Id == id);

            if (employee == null)
            {
                return NotFound($"Employee with ID {id} not found.");
            }

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> Create(int departmentId, [FromForm] string employeeJson, [FromForm] IFormFile foto)
        {
            if (!await DepartmentExists(departmentId))
            {
                return NotFound($"Department with ID {departmentId} not found.");
            }

            EmployeeViewModel employeeViewModel;
            try
            {
                employeeViewModel = JsonSerializer.Deserialize<EmployeeViewModel>(employeeJson);
            }
            catch (JsonException)
            {
                return BadRequest("Erro ao desserializar os dados do funcionário.");
            }

            if (employeeViewModel == null)
            {
                return BadRequest("Dados do funcionário inválidos.");
            }

            var employee = new Employee
            {
                nome = employeeViewModel.nome,
                rg = employeeViewModel.rg,
                departmentId = departmentId
            };

            if (foto != null && foto.Length > 0)
            {
                var fileName = await SaveFileAsync(foto);
                employee.foto = Path.Combine("uploads", fileName); 
            }

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { departmentId = departmentId, id = employee.Id }, employee);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int departmentId, int id, [FromForm] IFormFile foto, [FromForm] string employeeJson)
        {
            if (!await DepartmentExists(departmentId) || !await EmployeeExists(id))
            {
                return NotFound($"Employee with ID {id} not found in department {departmentId}.");
            }

            EmployeeViewModel employeeViewModel;
            try
            {
                employeeViewModel = JsonSerializer.Deserialize<EmployeeViewModel>(employeeJson);
            }
            catch (JsonException)
            {
                return BadRequest("Erro ao desserializar os dados do funcionário.");
            }

            if (employeeViewModel == null)
            {
                return BadRequest("Dados do funcionário inválidos.");
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.nome = employeeViewModel.nome;
            employee.rg = employeeViewModel.rg;

            // Atualize a foto se necessário
            if (foto != null && foto.Length > 0)
            {
                var fileName = await SaveFileAsync(foto);
                employee.foto = Path.Combine("uploads", fileName); 
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int departmentId, int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null || employee.departmentId != departmentId)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<string> SaveFileAsync(IFormFile file)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_uploadFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileName;
        }

        private async Task<bool> DepartmentExists(int id)
        {
            return await _context.Departments.AnyAsync(d => d.Id == id);
        }

        private async Task<bool> EmployeeExists(int id)
        {
            return await _context.Employees.AnyAsync(e => e.Id == id);
        }
    }
}
