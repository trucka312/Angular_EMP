import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  constructor(private http: HttpClient) {}

  getAllCertification(): Observable<any> {
    return this.http.get(AppConstants.BASE_URL_API + '/certifications');
  }
}
