import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

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

  private decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

 getUser() {
    return this.decodeToken();
  }

  // Ahora tus otros métodos son más cortos
  getUserId(): number | null {
    const decoded = this.decodeToken();
    return decoded ? Number(decoded.id) : null;
  }

  // Método extra para obtener el ROL directamente
 getUserRole(): string | null {
  // En lugar de decodificar el token, leemos la llave 'rol' que vimos en tu imagen
  return localStorage.getItem('rol'); 
}

  // Obtener el ID del usuario desde el Token

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