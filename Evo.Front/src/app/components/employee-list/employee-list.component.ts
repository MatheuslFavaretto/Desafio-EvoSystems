import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Router } from '@angular/router'; // Importe o Router aqui

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  departamentoNome: string = '';
  departamentoId: number = 1;
  employees: Employee[] = [];
  exibirFormularioModal: boolean = false;
  employeeEditando: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router // Adicione o Router aqui
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departamentoId = +params['departmentId'];
      this.loadEmployees();
      this.loadDepartmentName();
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.departamentoId)
      .subscribe((employees: Employee[]) => {
        this.employees = employees;
      });
  }

  loadDepartmentName(): void {
    this.departmentService.getDepartments()
      .subscribe((departments: Department[]) => {
        const department = departments.find(dep => dep.id === this.departamentoId);
        if (department) {
          this.departamentoNome = department.nome;
        }
      });
  }

  adicionarFuncionario(): void {
    this.employeeEditando = null;
    this.exibirFormularioModal = true;
  }

  fecharModal(): void {
    this.exibirFormularioModal = false;
  }

  editarFuncionario(employee: Employee): void {
    // Redirecione para a página de edição com o ID do funcionário
    this.router.navigate([`/departments/${this.departamentoId}/employees/${employee.id}`]);
  }

  excluirFuncionario(id: number): void {
    if (confirm('Tem certeza de que deseja excluir este funcionário?')) {
      this.employeeService.deleteEmployee(this.departamentoId, id)
        .subscribe(() => {
          this.loadEmployees();
        });
    }
  }
}
