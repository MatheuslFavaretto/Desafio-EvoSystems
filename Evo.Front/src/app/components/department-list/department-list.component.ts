import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  departmentEditing: Department | null = null;
  selectedDepartment: Department | null = null;

  showModal = false;
  @Output() closeForm = new EventEmitter<void>();

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => (this.departments = data),
      error: (e) => console.error(e),
    });
  }

  navigateToEmployees(departmentId: number): void {
    this.router.navigate(['/departments', departmentId, 'employees']);
  }

  createDepartment(): void {
    this.departmentEditing = null;
    this.showModal = true;
  }

  editDepartment(department: Department): void {
    this.departmentEditing = department;
    this.showModal = true;
  }

  deleteDepartment(id: number): void {
    if (confirm('Tem certeza que deseja excluir este departamento?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          alert('Departamento excluído com sucesso.');
          this.loadDepartments();
        },
        error: (e) => console.error(e),
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.loadDepartments();
  }
  viewEmployees(departmentId: number) {
    this.router.navigate(['/departments', departmentId, 'employees']);  }
}
