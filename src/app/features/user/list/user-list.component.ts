import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { Employee } from 'src/app/shared/models/employee.dto';
import { Department } from 'src/app/shared/models/department.model';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { CanDeactivate, RouteReuseStrategy, Router } from '@angular/router';
import { CustomRouteReuseStrategy } from 'src/app/shared/custom-route-reuse-strategy';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  departments: Department[] = [];
  employee: Employee = {
    departmentId: '',
  };
  department: Department = {};
  departmentId: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;
  totalEmployees?: number;
  sortFields: string = '';
  sortDirection = 'asc';
  sortName = 'asc';
  sortCertificateName = 'asc';
  sortEndDate = 'asc';

  constructor(
    public http: HttpClient,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    @Inject(RouteReuseStrategy) private reuseStrategy: CustomRouteReuseStrategy
  ) {}

  // Hàm khởi tạo component, được gọi khi component được tạo
  ngOnInit(): void {
    document.getElementById('employeeName')?.focus();
    this.loadDepartments();
    this.loadEmployees();
    console.log('Initialized');
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }

  // Load danh sách phòng ban
  private loadDepartments(): void {
    this.departmentService.getAllDepartment().subscribe((resp) => {
      this.departments = resp.data;
    });
  }

  // Load danh sách nhân viên
  private loadEmployees(): void {
    if (this.sortFields == 'ord_employee_name') {
      this.sortDirection = this.sortName;
    } else if (this.sortFields == 'ord_certification_name') {
      this.sortDirection = this.sortCertificateName;
    } else if (this.sortFields == 'ord_end_date') {
      this.sortDirection = this.sortEndDate;
    }

    this.employeeService
      .getEmployees(
        this.employee.employeeName,
        this.employee.departmentId,
        this.currentPage - 1,
        this.pageSize,
        this.sortFields,
        this.sortDirection
      )
      .subscribe((resp) => {
        this.employees = resp.data;
        this.totalEmployees = resp.totalRecords;
      });
  }

  // Xử lý thay đổi trang
  handlePageChange(event: number): void {
    this.currentPage = Math.max(event, 0);
    this.loadEmployees();
  }

  // Submit form tìm kiếm
  onSubmit(event: Event): void {
    event.preventDefault();
    this.search();
  }

  // Tìm kiếm nhân viên
  search(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  // Xử lý thay đổi sắp xếp
  onSortChange(sortFields: string, sortDirection: string): void {
    // this.sortFields = sortFields;
    // this.sortDirection = sortDirection;
    if (sortFields == 'ord_employee_name') {
      this.sortFields = sortFields;
      this.sortName = sortDirection;
    } else if (sortFields == 'ord_certification_name') {
      this.sortFields = sortFields;
      this.sortCertificateName = sortDirection;
    } else if (sortFields == 'ord_end_date') {
      this.sortFields = sortFields;
      this.sortEndDate = sortDirection;
    }
    this.currentPage = 1;
    this.loadEmployees();
  }

  onViewEmployee(value: any): void {
    this.reuseStrategy.clearRoute('user/detail');
    this.router.navigate(['/user/detail'], {
      state: { employeeId: value },
    });
  }

  onAddEmployee(): void {
    this.reuseStrategy.clearRoute('user/add');
    this.router.navigate(['/user/add']);
  }
}
