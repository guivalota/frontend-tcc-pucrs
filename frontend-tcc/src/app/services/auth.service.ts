import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5063/api/v1/Auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: { login: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }
}

export interface User {
  Id: number;
  Email: string;
  Login: string;
  password?: string;
  emailVerificationToken?: string;
  emailVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = 'http://localhost:5063/api/v1/Auth/listar-usuarios';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User[]>(this.api, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar usuários:', error);
        return of([]);
      })
    );
  }
}
