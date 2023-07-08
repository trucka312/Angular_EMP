import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../../app-constants';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  getAllDepartment(): Observable<any> {
    return this.http.get(AppConstants.BASE_URL_API + '/departments');
  }
}
