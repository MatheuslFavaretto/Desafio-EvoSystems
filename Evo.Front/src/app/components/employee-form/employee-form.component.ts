import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Input() employeeToEdit: Employee | null = null;
  @Output() formClose = new EventEmitter<void>();
  funcionarioForm: FormGroup;
  selectedFile: File | null = null;
  departmentId: number | null = null;
  isEditing: boolean = false; // Variable to track if it's editing

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      rg: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = +params['departmentId'];

      // Check if there's an ID in the URL
      if (params['id']) {
        this.isEditing = true; // It's editing
        // Load the employee to edit here using the ID from the URL
        this.employeeService.getEmployee(this.departmentId, +params['id']).subscribe(employee => {
          this.employeeToEdit = employee;
          this.patchFormWithEmployeeData();
        });
      } else {
        this.isEditing = false; // It's creating
      }
    });

    if (this.employeeToEdit) {
      this.patchFormWithEmployeeData();
    }
  }

  private patchFormWithEmployeeData() {
    this.funcionarioForm.patchValue({
      nome: this.employeeToEdit?.nome,
      rg: this.employeeToEdit?.rg
    });
  }

  aoSelecionarFoto(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length) {
      this.selectedFile = element.files[0];
    }
  }

  salvar(): void {
    if (this.funcionarioForm.valid && this.departmentId) {
      const formData = this.createFormData();
  
      if (this.isEditing && this.employeeToEdit && this.employeeToEdit.id) {
        this.employeeService.updateEmployee(this.departmentId, this.employeeToEdit.id, formData).subscribe({
          next: () => {
            this.clearForm();
            this.formClose.emit();
          },
          error: (error) => console.error('Erro ao atualizar o funcionário', error)
        });
      } else {
        this.employeeService.createEmployee(this.departmentId, formData).subscribe({
          next: () => {
            this.clearForm();
            this.formClose.emit();
          },
          error: (error) => console.error('Erro ao criar o funcionário', error)
        });
      }
    } else {
      console.error('Formulário inválido ou ID do departamento não encontrado');
    }
  }

  createFormData(): FormData {
    const formData = new FormData();
    const employeeData = {
      nome: this.funcionarioForm.get('nome')?.value,
      rg: this.funcionarioForm.get('rg')?.value
    };
  
    // Serialize the employee object to JSON and append it to FormData as 'employeeJson'
    formData.append('employeeJson', JSON.stringify(employeeData));
  
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }
  
    return formData;
  }
  
  clearForm(): void {
    this.funcionarioForm.reset();
    this.selectedFile = null;
    this.formClose.emit();
  }
}
