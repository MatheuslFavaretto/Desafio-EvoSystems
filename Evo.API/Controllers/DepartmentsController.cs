using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Evo.API.Data;
using Evo.API.Models;


namespace Evo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase 
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments() 
        {
            return await _context.Departments.ToListAsync(); 
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id) 
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            return department; 
        }

        [HttpPost]
        public async Task<ActionResult<Department>> PostDepartment(Department department) 
        {
            _context.Departments.Add(department); 
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, department); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(int id, Department updatedDepartment) 
        {
            if (id != updatedDepartment.Id) 
            {
                return BadRequest();
            }

            _context.Entry(updatedDepartment).State = EntityState.Modified; 

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id)) 
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
        public async Task<IActionResult> DeleteDepartment(int id) 
        {
            var department = await _context.Departments.FindAsync(id); 

            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department); 
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartmentExists(int id) 
        {
            return _context.Departments.Any(e => e.Id == id); 
        }
    }
}
