import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:8080/api/admin';
  private apiCliente = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  // Usuarios
  getUsuarios() {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.api}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  eliminarUsuario(id: number) {
    const token = localStorage.getItem('token');

    return this.http.delete(`${this.api}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Clientes

  // GEO

 getProvincias() {
  const token = localStorage.getItem('token');

  return this.http.get<any>(
    'http://localhost:8080/api/geo/provincias',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

getLocalidades(codProvincia: string) {
  const token = localStorage.getItem('token');

  return this.http.get<any>(
    `http://localhost:8080/api/geo/municipios/${codProvincia}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  getClientes() {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.apiCliente}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  nuevoCliente(data: any) {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.apiCliente}/registro-completo`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  editarCliente(id: number, data: any) {
    const token = localStorage.getItem('token');

    return this.http.put(`${this.apiCliente}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  eliminarCliente(id: number) {
    const token = localStorage.getItem('token');

    return this.http.delete(`${this.apiCliente}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  
}