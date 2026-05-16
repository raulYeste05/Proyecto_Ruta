import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = `${environment.apiUrl}/api/publicaciones`;

  constructor(private http: HttpClient) {}


  // Para publicar una ruta
  crearPublicacion(publicacion: { userId: number, rutaId: number, titulo: string, contenido: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, publicacion);
  }

  eliminarPublicacionPorRuta(rutaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ruta/${rutaId}`);
  }

  eliminarPublicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Para el muro de la comunidad
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


}