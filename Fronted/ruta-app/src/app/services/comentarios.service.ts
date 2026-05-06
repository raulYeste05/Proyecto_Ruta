import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = `${environment.apiUrl}/api/comentarios`;

  constructor(private http: HttpClient) {}

  listarPorPublicacion(pubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicacion/${pubId}`);
  }

  crearComentario(comentario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, comentario);
  }

  contarComentarios(publicacionId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/publicacion/${publicacionId}/count`);
  }

  eliminarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}