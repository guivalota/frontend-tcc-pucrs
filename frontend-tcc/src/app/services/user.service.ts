import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterData {
  email: string;
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = 'http://localhost:5063/api/v1/Auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post<string>('http://localhost:5063/api/v1/Auth/register', data, {
      responseType: 'text' as 'json'
    });
  }
}