import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { RgFormatPipe } from './format/rg-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DepartmentFormComponent,
    DepartmentListComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
    RgFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
