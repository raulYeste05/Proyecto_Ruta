import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = `${environment.apiUrl}/api/clientes`;

  constructor(private http: HttpClient) { }

  getPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil`);
  }

 
  actualizarPerfil(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos);
  }
}