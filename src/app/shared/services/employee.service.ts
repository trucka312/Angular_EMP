import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { AppConstants } from '../../app-constants';
import { Employee } from '../models/employee.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  public salutation: BehaviorSubject<string> = new BehaviorSubject('');
  public firstName: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private http: HttpClient) {}

  // Lấy danh sách nhân viên từ server
  getEmployees(
    name?: string,
    departmentId?: string,
    pageNo?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string
  ): Observable<any> {
    const params = this.buildParams(
      name,
      departmentId,
      pageNo,
      pageSize,
      sortBy,
      sortDirection
    );
    return this.http.get(`${AppConstants.BASE_URL_API}/employee`, {
      params,
    });
  }

  // Xây dựng các tham số cho request HTTP
  private buildParams(
    name?: string,
    departmentId?: string,
    pageNo?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string
  ): HttpParams {
    let params = new HttpParams();

    if (name) {
      params = params.set('employee_name', name);
    }
    if (departmentId) {
      params = params.set('department_id', departmentId);
    }
    if (pageNo) {
      params = params.set('offset', pageNo);
    }
    if (pageSize) {
      params = params.set('limit', pageSize);
    }
    if (sortBy && sortBy.length > 0) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }
    return params;
  }

  // Đếm số lượng nhân viên từ server
  countEmployee(name?: string, departmentId?: string): Observable<any> {
    const params = this.buildParams(name, departmentId);
    return this.http.get(`${AppConstants.BASE_URL_API}/count-employee`, {
      params,
    });
  }

  // Kiểm tra sự tồn tại của nhân viên dựa trên employeeLoginId và employeeId
  findExistingEmployee(
    employeeLoginId?: string,
    employeeId?: number
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${AppConstants.BASE_URL_API}/exists-employee-login-id`,
      {
        params: new HttpParams()
          .set('employee_login_id', employeeLoginId!)
          .set('employee_id', employeeId || 0),
      }
    );
  }

  // Lưu thông tin nhân viên lên server
  saveEmployee(employee: Employee): any {
    return this.http.post(`${AppConstants.BASE_URL_API}/employee`, employee);
  }

  // Lấy thông tin nhân viên từ server dựa trên employeeId
  findEmployee(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${AppConstants.BASE_URL_API}/employee/${employeeId}`
    );
  }

  // Xóa nhân viên từ server dựa trên employeeId
  deleteEmployee(employeeId: any): Observable<any> {
    return this.http.delete(
      `${AppConstants.BASE_URL_API}/employee/${employeeId}`
    );
  }

  // Cập nhật thông tin nhân viên lên server
  updateEmployee(employee: Employee): any {
    return this.http.put(`${AppConstants.BASE_URL_API}/employee`, employee);
  }
}
