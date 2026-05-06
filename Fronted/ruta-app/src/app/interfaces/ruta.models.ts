// modelo de tramo individual
export interface Tramo {
  modo: 'driving-car' | 'foot-walking' | 'cycling-regular';
  coordenadas: number[][]; // Formato [lng, lat] para la API
  distancia: number;       // en metros
  duracion: number;        // en segundos
  nombreParada?: string;   // opcional: por si quieres nombrar la parada
}

// modelo de la ruta completa acumulada
export interface RutaMixta {
  tramos: Tramo[];
  distanciaTotalCoche: number;
  distanciaTotalAndando: number;
  tiempoTotalCoche: number;
  tiempoTotalAndando: number;
  esIdaYVuelta: boolean;
}