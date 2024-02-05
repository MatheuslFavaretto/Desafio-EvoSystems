using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Evo.API.Models
{
    public class Employee
    {
        [Key]
        [DisplayName("Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Informe o nome")]
        [StringLength(80, ErrorMessage = "O nome deve conter até 80 caracteres")]
        [MinLength(5, ErrorMessage = "O nome deve conter pelo menos 5 caracteres")]
        [DisplayName("Nome Completo")]
        public string nome { get; set; }

        [DisplayName("Foto")]
        public string? foto { get; set; }

        [Required(ErrorMessage = "Informe o número do RG")]
        [StringLength(11, ErrorMessage = "O RG deve conter até 11 caracteres")]
        [MinLength(9, ErrorMessage = "O RG deve conter pelo menos 9 caracteres")]
        [DisplayName("RG")]
        public string rg { get; set; }

        [DisplayName("Departamento")]
        [Required(ErrorMessage = "Departamento Inválido")]
        public int departmentId { get; set; }
        public Department? Department { get; set; }
    }
}
