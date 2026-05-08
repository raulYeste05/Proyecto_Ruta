import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrlORS = 'https://api.openrouteservice.org/v2/directions';
  private apiRuta = `${environment.apiUrl}/api/rutas`;
  private apiParada = `${environment.apiUrl}/api/paradas`;
  private apiServicioCercano = `${environment.apiUrl}/api/servicio_cercano`;

  constructor(private http: HttpClient) {}

  getRoute(puntos: number[][], transporte: string = 'driving-car'): Observable<any> {
    const body = { coordinates: puntos };
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': environment.orsApiKey.trim()
    });
    return this.http.post(`${this.apiUrlORS}/${transporte}/geojson`, body, { headers });
  }

  // Guardar la cabecera de la ruta
  guardarRuta(ruta: any): Observable<any> {
    // No necesitamos pasar el token aquí, el AuthInterceptor lo inyecta solo
    return this.http.post<any>(this.apiRuta, ruta);
  }

  // Obtener todas las rutas de un usuario
  getHistorialUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiRuta}/user/${userId}`);
  }
  //Metodo para obtener todas las rutas
  getAllRutas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRuta); // GET /api/rutas
  }


  // Guardar cada tramo como una parada
  guardarParada(parada: any): Observable<any> {
    return this.http.post<any>(this.apiParada, parada);
  }

  //Obtener los servicios cercanos de una parada

  // En rutas.service.ts
  getServiciosCercanos(paradaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServicioCercano}/parada/${paradaId}`);
  }

  // Nuevo método para buscar por coordenadas (sin necesidad de ID de parada)
  getServiciosPorCoordenadas(lat: number, lng: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServicioCercano}/buscar?lat=${lat}&lng=${lng}`);
  }




  //Metodo para obtener las rutas guardadas por el usuario
  getParadasByRuta(rutaId: number): Observable<any[]> {
    // Este endpoint debe devolver List<Parada> filtrado por ruta_id en Spring Boot
    return this.http.get<any[]>(`${this.apiParada}/ruta/${rutaId}`);
  }



  // Eliminar una ruta
  deleteRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiRuta}/${id}`);
  }

}