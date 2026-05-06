import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Ajusta la URL según tu configuración de Spring Boot
  private apiUrl = `${environment.apiUrl}/api/clientes`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el perfil del cliente logueado.
   * Spring identificará al usuario mediante el Token JWT 
   * que el Interceptor añade automáticamente.
   */
  getPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil`);
  }

  /**
   * Actualiza los datos del cliente.
   * @param id ID del cliente a actualizar
   * @param datos Objeto con los nuevos datos (ClienteRequestDTO)
   */
  actualizarPerfil(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos);
  }
}