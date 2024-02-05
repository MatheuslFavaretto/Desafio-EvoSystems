import { Department } from "./department.model";

export type Employee = {
    id: number,
    nome: string,
    foto?: string, 
    rg: string,
    departmentId: number | undefined,
    department: Department; 
};

export type EmployeeCadastro = Omit<Employee, 'id' | 'department' | 'fotoPath'>;
