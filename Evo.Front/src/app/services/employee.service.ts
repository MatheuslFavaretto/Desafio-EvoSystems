import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5233/api/departments';

  constructor(private http: HttpClient) { }

  getEmployees(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/${departmentId}/employees`);
  }

  getEmployee(departmentId: number, employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${departmentId}/employees/${employeeId}`);
  }

  createEmployee(departmentId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${departmentId}/employees`, formData);
  }

  updateEmployee(departmentId: number, employeeId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${departmentId}/employees/${employeeId}`, formData);
  }
  deleteEmployee(departmentId: number, employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${departmentId}/employees/${employeeId}`);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  searchEmployeesByName(nome: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees?name=${nome}`);
  }

  uploadEmployeeData(departmentId: number, formData: FormData): Observable<Employee> {
    const url = this.getEmployeeUrl(departmentId);
    return this.http.post<Employee>(url, formData);
  }

  private getEmployeeUrl(departmentId: number, employeeId?: number): string {
    let url = `${this.apiUrl}/${departmentId}/employees`;
    if (employeeId !== undefined) {
      url += `/${employeeId}`;
    }
    return url;
  }
}

