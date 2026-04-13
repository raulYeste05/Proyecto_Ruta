import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provincia, Municipio } from '../interfaces/geo.interface';

@Injectable({ providedIn: 'root' })
export class GeoService {

  private baseUrl = 'http://localhost:8080/api/geo';

  constructor(private http: HttpClient) {}

  getProvincias() {
  return this.http.get<any>(`${this.baseUrl}/provincias`);
}

  getMunicipios(codProvincia: string) {
    return this.http.get<{ data: Municipio[] }>(`${this.baseUrl}/municipios/${codProvincia}`);
  }

}