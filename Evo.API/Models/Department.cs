using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Evo.API.Models
{
    public class Department
    {
        [Key]
        [DisplayName("Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Informe o nome")]
        [StringLength(80, ErrorMessage = "O nome deve conter até 80 caracteres")]
        [MinLength(5, ErrorMessage = "O nome deve conter pelo menos 5 caracteres")]
        [DisplayName("Nome")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Informe a sigla")]
        [StringLength(5, ErrorMessage = "A sigla deve conter até 5 caracteres")]
        [MinLength(2, ErrorMessage = "A sigla deve conter pelo menos 2 caracteres")]
        [DisplayName("Sigla do Departamento")]
        public string Sigla { get; set; }
    }
}