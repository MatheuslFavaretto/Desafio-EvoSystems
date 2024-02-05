import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  @Input() departamento: Department | null = null;
  @Output() fecharFormulario = new EventEmitter<void>();
  departamentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departamentoForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.departamento) {
      this.departamentoForm.patchValue(this.departamento);
    }
  }

  salvar(): void {
    if (this.departamentoForm.valid) {
      const departmentData = this.departamentoForm.value;
      let operacao;
      if (this.departamento && this.departamento.id) {
        operacao = this.departmentService.updateDepartment({ ...departmentData, id: this.departamento.id });
      } else {
        operacao = this.departmentService.createDepartment(departmentData);
      }
      operacao.subscribe({
        next: () => {
          alert('Operação realizada com sucesso.');
          this.fecharFormulario.emit();
        },
        error: (e) => console.error(e)
      });
    } else {
      console.error('Formulário inválido');
    }
  }
}
