import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  registro(datos: any) {
    return this.http.post<any>(`${this.apiUrl}/registro`, datos);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  guardarSesion (token: string, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLogged() {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  checkDni(dni: string) {
    return this.http.get<boolean>(`${this.apiUrl}/check-dni?dni=${dni}`);
  }
}