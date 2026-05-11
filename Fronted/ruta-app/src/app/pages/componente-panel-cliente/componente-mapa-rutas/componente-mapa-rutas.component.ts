import { ClienteService } from './../../../services/cliente.service';
import { RutasService } from '../../../services/rutas.service';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tramo } from '../../../interfaces/ruta.models';
import { ActivatedRoute } from '@angular/router';

import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { ToastController } from '@ionic/angular';
import { arrowBackOutline } from 'ionicons/icons';
import { pizza, cafe, leaf, water } from 'ionicons/icons';

// Importación necesaria para que los iconos funcionen en Standalone
import { addIcons } from 'ionicons';
import { car, walk, trashOutline, flagOutline, locateOutline, timeOutline, resizeOutline, bicycle, checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mapa-rutas',
  templateUrl: './componente-mapa-rutas.component.html',
  styleUrls: ['./componente-mapa-rutas.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MapaRutasPage implements OnInit, AfterViewInit {
  map!: L.Map;
  puntosRuta: number[][] = [];
  polylineActual: any;
  marcadores: L.Marker[] = [];
  tipoTransporte: string = 'driving-car';
  distancia: string = '';
  duracion: string = '';
  cargandoUbicacion: boolean = false;

  idRutaActual: number | null = null; // Para rastrear la ruta en curso
  tramosConfirmados: any[] = [];
  datosTramoActual: Tramo | null = null;
  // Añadimos un array para limpiar los marcadores de servicios si fuera necesario
  marcadoresServicios: L.Marker[] = [];


  totales = {
    kmCoche: 0,
    tiempoCoche: 0,
    kmAndando: 0,
    tiempoAndando: 0,
    kmBici: 0,     
    tiempoBici: 0   
  };

 //Variables para el modo libre
 private intervalRef: any; // Intervalo para actualizar la posición
 isModoLibre: boolean = false;
 watchId: any;
 puntosTrayectoLibre: L.LatLng[] = [];
 tiempoInicioTramo: number = 0;
 distanciaAcumuladaTramo: number = 0;

 //Variables para el modo admin
 esAdmin: boolean = false;
  
  constructor(private RutasService: RutasService,
              private ClienteService: ClienteService,
              private AuthService: AuthService,
              private toastController: ToastController,
              private alertController: AlertController,
              private route: ActivatedRoute,
              private router: Router
  ) {
    // Registramos los iconos para evitar errores en consola
    addIcons({ car, walk, bicycle, trashOutline, flagOutline, locateOutline, timeOutline, resizeOutline, checkmarkDoneOutline, pizza, leaf, water, cafe, arrowBackOutline });
  }

 ngOnInit() {
    const rol = this.AuthService.getUserRole(); 
    console.log("El rol detectado es:", rol); // <--- AÑADE ESTO PARA DEPURAR
    this.esAdmin = (rol === 'ADMIN');
  }

  ngAfterViewInit() {
    this.initMap();

    setTimeout(() => {
      if (this.map){
        this.map.invalidateSize();
        console.log("Mapa cargado");
      }
    }, 400);


    // Comprobamos los parámetros aquí, DESPUÉS de initMap()
    this.route.queryParams.subscribe(params => {
      if (params['idRuta']) {
        // Usamos un pequeño timeout para asegurar que Leaflet está listo
        setTimeout(() => {
          this.cargarRutaGuardada(Number(params['idRuta']));
        }, 500);
      }
    });
  }

  volverAlPanelAdmin(){
    this.router.navigate(['/componente-panel-admin/rutas']);
  }

  initMap() {
    this.map = L.map('mapId').setView([36.7213, -4.4214], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.añadirMarcador(e.latlng);
    });
  }

  añadirMarcador(coords: L.LatLng) {
    this.puntosRuta.push([coords.lng, coords.lat]); 
    const nuevoMarcador = L.marker([coords.lat, coords.lng]).addTo(this.map);
    this.marcadores.push(nuevoMarcador);

    if (this.puntosRuta.length >= 2) {
      this.calcularYDibujarRuta();
    }
  }

  crearRutaAutomatica() {
    this.limpiarMapa();
    const inicio: [number, number] = [-4.4214, 36.7213]; 
    const fin: [number, number] = [-4.4111, 36.7262];
    this.puntosRuta = [inicio, fin];
    this.marcadores.push(L.marker([36.7213, -4.4214]).addTo(this.map));
    this.marcadores.push(L.marker([36.7262, -4.4111]).addTo(this.map));
    this.calcularYDibujarRuta();
  }

  cambiarTransporte(event: any) {
    this.tipoTransporte = event.target.value;
    if (this.puntosRuta.length >= 2) {
      this.calcularYDibujarRuta();
    }
  }

  obtenerUbicacionActual() {
    this.cargandoUbicacion = true;
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      this.cargandoUbicacion = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.limpiarMapa();
        this.map.setView([lat, lng], 15);
        this.añadirMarcador(L.latLng(lat, lng));
        this.cargandoUbicacion = false;
      },
      (error) => {
        this.cargandoUbicacion = false;
        alert('No se pudo obtener tu ubicación.');
      }
    );
  }

  calcularYDibujarRuta() {
    this.RutasService.getRoute(this.puntosRuta, this.tipoTransporte).subscribe({
      next: (res: any) => {
        // CORRECCIÓN 1: Limpiar antes de procesar nada nuevo
        if (this.polylineActual) {
          this.map.removeLayer(this.polylineActual);
          this.polylineActual = null;
        }

        try {
          if (res.type === 'FeatureCollection' && res.features.length > 0) {
            // Dibujamos la polilínea
            this.polylineActual = L.geoJSON(res, {
              style: { color: '#3880ff', weight: 6, opacity: 0.8 }
            }).addTo(this.map);

            const summary = res.features[0].properties.summary;
            if (summary) {
              this.distancia = (summary.distance / 1000).toFixed(2) + ' km';
              const totalMinutos = Math.round(summary.duration / 60);
              this.duracion = totalMinutos >= 60 
                ? `${Math.floor(totalMinutos/60)}h ${totalMinutos%60}min` 
                : `${totalMinutos} min`;
              
              this.actualizarDatosTramoTemporal(summary);
            }

            // CORRECCIÓN 2: Asegurar que la polilínea existe antes de pedir sus bordes
            const bounds = this.polylineActual.getBounds();
            if (bounds && bounds.isValid()) {
              this.map.fitBounds(bounds, { padding: [50, 50] });
            }else{
              this.mostrarErrorRuta();
            }
          }
        } catch (e) {
          console.warn("Error visualizando ruta (posible tramo inválido):", e);
        }
      },
      error: (err) => {
        console.error("Error en servidor ORS:", err);
        this.mostrarErrorRuta();
      }
    });
  }

  async mostrarErrorRuta() {
    const toast = await this.toastController.create({
      message: '📍 Ruta inaccesible. No hay caminos disponibles en esta zona.',
      duration: 3500, // Un poquito más de tiempo para que de tiempo a leer
      position: 'middle', // <--- CAMBIADO A MIDDLE PARA MÁS VISIBILIDAD
      color: 'danger',
      cssClass: 'custom-toast', // Opcional por si quieres darle más estilo
      buttons: [
        {
          text: 'ENTENDIDO',
          role: 'cancel'
        }
      ]
    });
    await toast.present();

    // Limpiar el último punto fallido
    if (this.puntosRuta.length > 0) {
      this.puntosRuta.pop();
      const m = this.marcadores.pop();
      if (m) this.map.removeLayer(m);
    }
  }
  limpiarMapa() {
    if (this.polylineActual) {
      this.map.removeLayer(this.polylineActual);
      this.polylineActual = null;
    }
    this.marcadores.forEach(m => this.map.removeLayer(m));
    this.marcadores = [];
    this.puntosRuta = [];
    this.distancia = '';
    this.duracion = '';
    this.datosTramoActual = null;
  }

  actualizarDatosTramoTemporal(summary: any) {
    this.datosTramoActual = {
      modo: this.tipoTransporte as any,
      coordenadas: [...this.puntosRuta],
      distancia: summary.distance,
      duracion: summary.duration
    };
  }

   confirmarTramoYContinuar() {
    if (!this.datosTramoActual) return;

    const lat = this.isModoLibre 
      ? this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1].lat 
      : this.puntosRuta[this.puntosRuta.length - 1][1];
    
    const lng = this.isModoLibre 
      ? this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1].lng 
      : this.puntosRuta[this.puntosRuta.length - 1][0];

    const nuevaParada = {
      orden: this.tramosConfirmados.length + 1,
      latitud: lat,
      longitud: lng,
      tipoTransporte: this.obtenerTipoEnum(),
      tiempoEstimado: Math.round(this.datosTramoActual.duracion / 60),
      distanciaEstimada: this.datosTramoActual.distancia
    };

    this.tramosConfirmados.push(nuevaParada);
    this.acumularTotales();

    // --- NUEVA LÓGICA: BUSCAR SERVICIOS SIN GUARDAR EN DB ---
    this.RutasService.getServiciosPorCoordenadas(lat, lng).subscribe({
    next: (servicios) => {
      // Llamamos al método que ya tenías para pintar los círculos en el mapa
      this.pintarServiciosEnMapa(servicios); 
    },
    error: (err) => console.error("Error buscando servicios temporales", err)
  });

    // Limpieza para el siguiente tramo...
    if (!this.isModoLibre) {
      if (this.polylineActual) this.map.removeLayer(this.polylineActual);
      this.puntosRuta = [[lng, lat]];
    }

    this.datosTramoActual = null;
    this.distancia = '';
    this.duracion = '';
    this.mostrarToastSuccess('Tramo añadido. Buscando servicios cercanos...');

    if (this.isModoLibre) {
      this.presentarAlertaSiguientePaso();
    }
  }

// Factorizamos la lógica de pintado para no repetir código
private pintarServiciosEnMapa(servicios: any[]) {
  if (!servicios || servicios.length === 0) return;

  servicios.forEach(srv => {
    const tipoOriginal = srv.tipo || 'desconocido';
    let color = '#737373';
    if (tipoOriginal === 'gasolinera') color = '#f04141';
    else if (tipoOriginal === 'restaurante') color = '#3880ff';
    else if (tipoOriginal === 'area_descanso') color = '#2dd36f';

    const srvMarker = L.circleMarker([srv.latitud, srv.longitud], {
      radius: 9,
      fillColor: color,
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9
    }).addTo(this.map);

    srvMarker.bindPopup(`
      <div style="text-align: center;">
        <strong>${srv.nombre}</strong><br>
        <span style="color: ${color}; font-weight: bold;">${tipoOriginal.toUpperCase()}</span>
      </div>
    `);

    this.marcadoresServicios.push(srvMarker as any);
  });
}

  // Helper para el Enum
  private obtenerTipoEnum() {
    if (this.tipoTransporte === 'driving-car') return 'coche';
    if (this.tipoTransporte === 'cycling-regular') return 'bicicleta';
    return 'andando';
  }

    

// Un pequeño helper para avisar al usuario
async mostrarToastSuccess(msj: string) {
  const toast = await this.toastController.create({
    message: msj,
    duration: 2000,
    color: 'success',
    position: 'top'
  });
  toast.present();
}

  private acumularTotales() {
    if (this.tipoTransporte === 'driving-car') {
      this.totales.kmCoche += this.datosTramoActual!.distancia;
      this.totales.tiempoCoche += this.datosTramoActual!.duracion;
    } else if (this.tipoTransporte === 'cycling-regular') {
      this.totales.kmBici += this.datosTramoActual!.distancia;
      this.totales.tiempoBici += this.datosTramoActual!.duracion;
    } else {
      this.totales.kmAndando += this.datosTramoActual!.distancia;
      this.totales.tiempoAndando += this.datosTramoActual!.duracion;
    }
  }

  cancelarTramoActual() {
    this.limpiarMapa();
  }

    async finalizarViaje() {
    // 1. Si el usuario tiene un tramo en el mapa pero no le dio a "Añadir", 
    // lo procesamos automáticamente para que no se pierda esa distancia/tiempo.
    if (this.datosTramoActual) {
      const confirmarAutomatico = confirm("Tienes un tramo sin añadir, ¿quieres incluirlo en el resumen final?");
      if (confirmarAutomatico) {
        // Reutilizamos la lógica de confirmar para que sume a los totales
        const lat = this.isModoLibre 
          ? this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1].lat 
          : this.puntosRuta[this.puntosRuta.length - 1][1];
        
        const lng = this.isModoLibre 
          ? this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1].lng 
          : this.puntosRuta[this.puntosRuta.length - 1][0];

        const nuevaParada = {
          orden: this.tramosConfirmados.length + 1,
          latitud: lat,
          longitud: lng,
          tipoTransporte: this.obtenerTipoEnum(),
          tiempoEstimado: Math.round(this.datosTramoActual.duracion / 60),
          distanciaEstimada: this.datosTramoActual.distancia
        };
        this.tramosConfirmados.push(nuevaParada);
        this.acumularTotales();
      }
    }

    // 2. Verificación de seguridad
    if (this.tramosConfirmados.length === 0) {
      alert("No hay tramos confirmados para guardar.");
      return;
    }

    //Extraemos el id del usuario
    const userId = this.AuthService.getUserId();
    if (!userId) {
      alert("No se pudo obtener el ID del usuario. Por favor, inicia sesión.");
      return;
    }

    const titulo = prompt("Asigna un nombre a esta ruta:");
    if (!titulo) return;

    const volverMismoCamino = confirm("¿Vas a volver por donde has venido? (Se duplicará la distancia y el tiempo)");
    
    // 3. GENERAR EL RESUMEN (Ahora sí, con todos los totales sumados)
    const resumenDescripcion = this.generarResumenTexto(volverMismoCamino);

    this.ClienteService.getPerfil().subscribe(perfil => {
      const rutaDTO = {
        userId: userId,
        titulo: titulo,
        descripcion: resumenDescripcion,
        publicada: false
      };

      this.RutasService.guardarRuta(rutaDTO).subscribe({
        next: (rutaGuardada) => {
          this.guardarTramosEnSerie(rutaGuardada.id);
        },
        error: (err) => {
          console.error("Error al guardar cabecera:", err);
          alert("Error al conectar con el servidor.");
        }
      });
    });
  }

  private generarResumenTexto(volverMismoCamino: boolean): string {
    const factor = volverMismoCamino ? 2 : 1;
    const textoVuelta = volverMismoCamino ? " (Ida y Vuelta)" : " (Solo ida)";

    // Helper para convertir segundos/minutos a H y M
    const formatTime = (segundos: number) => {
      const minutosTotales = (segundos / 60) * factor;
      const h = Math.floor(minutosTotales / 60);
      const m = Math.round(minutosTotales % 60);
      if (h > 0) return `${h}h${m > 0 ? ' ' + m + 'min' : ''}`;
      return `${m} min`;
    };

    const formatKm = (metros: number) => ((metros / 1000) * factor).toFixed(2);

    let resumen = `Resumen${textoVuelta}:\n`;
    let hayAlgo = false;

    if (this.totales.kmCoche > 0) {
      resumen += `- Coche: ${formatKm(this.totales.kmCoche)} km | ${formatTime(this.totales.tiempoCoche)}\n`;
      hayAlgo = true;
    }
    if (this.totales.kmBici > 0) {
      resumen += `- Bicicleta: ${formatKm(this.totales.kmBici)} km | ${formatTime(this.totales.tiempoBici)}\n`;
      hayAlgo = true;
    }
    if (this.totales.kmAndando > 0) {
      resumen += `- Andando: ${formatKm(this.totales.kmAndando)} km | ${formatTime(this.totales.tiempoAndando)}\n`;
      hayAlgo = true;
    }

    const totalKm = (this.totales.kmCoche + this.totales.kmBici + this.totales.kmAndando);
    const totalSeg = (this.totales.tiempoCoche + this.totales.tiempoBici + this.totales.tiempoAndando);

    resumen += `--------------------------\n`;
    resumen += `TOTAL: ${formatKm(totalKm)} km | ${formatTime(totalSeg)}`;

    // Si por algún error extraño no hay datos, evitamos el "Calculando tramos"
    return hayAlgo ? resumen : "Ruta sin desplazamientos registrados.";
  }

  private guardarTramosEnSerie(rutaId: number) {
    let guardados = 0;
    
    this.tramosConfirmados.forEach(parada => {
      parada.rutaId = rutaId;
      this.RutasService.guardarParada(parada).subscribe({
        next: (paradaDB) => {
          // Buscamos servicios para cada parada guardada en la DB
          this.dibujarServiciosCercanos(paradaDB.id);
          
          guardados++;
          if (guardados === this.tramosConfirmados.length) {
            this.mostrarToastSuccess('¡Viaje y paradas guardadas correctamente!');
            this.resetearMapaYTotales();
          }
        },
        error: (err) => console.error("Error al guardar tramo:", err)
      });
    });
  }

  resetearMapaYTotales() {
    this.limpiarMapa();
    this.tramosConfirmados = [];
    this.totales = { 
      kmCoche: 0, tiempoCoche: 0, 
      kmAndando: 0, tiempoAndando: 0, 
      kmBici: 0, tiempoBici: 0 
    };
    this.marcadoresServicios.forEach(m => this.map.removeLayer(m));
    this.marcadoresServicios = [];
  }


  // 2. Método para buscar y pintar servicios
    dibujarServiciosCercanos(paradaId: number) {
    this.RutasService.getServiciosCercanos(paradaId).subscribe({
      next: (servicios) => {
        console.log("Servicios recibidos para procesar:", servicios);

        if (!servicios || servicios.length === 0) return;

        servicios.forEach(srv => {
          // Usamos 'srv.tipo' porque así viene en tu objeto de la consola
          const tipoOriginal = srv.tipo || 'desconocido';
          const tipoUpper = tipoOriginal.toUpperCase();

          // Configuración de colores según el tipo
          let color = '#737373'; // Gris por defecto
          if (tipoOriginal === 'gasolinera') color = '#f04141'; // Rojo
          else if (tipoOriginal === 'restaurante') color = '#3880ff'; // Azul
          else if (tipoOriginal === 'area_descanso') color = '#2dd36f'; // Verde

          // Crear el marcador circular en el mapa
          const srvMarker = L.circleMarker([srv.latitud, srv.longitud], {
            radius: 9,
            fillColor: color,
            color: "#fff",
            weight: 2,
            fillOpacity: 0.9
          }).addTo(this.map);

          // Popup con los datos que ya sabemos que existen
          srvMarker.bindPopup(`
            <div style="text-align: center;">
              <strong>${srv.nombre}</strong><br>
              <span style="color: ${color}; font-weight: bold;">${tipoUpper}</span><br>
              <small>Distancia: ${Math.round(srv.distancia)}m</small>
            </div>
          `);

          this.marcadoresServicios.push(srvMarker as any);
        });
      },
      error: (err) => console.error("Error al obtener servicios:", err)
    });
  }


  // MODO LIBRE

  toggleModoLibre() {
    if (this.isModoLibre) {
      this.detenerRastreo();
    } else {
      this.iniciarRastreo();
    }
  }

  iniciarRastreo() {
    this.limpiarMapa();
    this.isModoLibre = true;
    this.puntosTrayectoLibre = [];
    this.distanciaAcumuladaTramo = 0;
    this.tiempoInicioTramo = Date.now();

    // Función que procesa la posición (la sacamos fuera para reutilizarla)
    const procesarPosicion = (pos: GeolocationPosition) => {
      const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
      
      // Solo añadimos el punto si es distinto al último (evita ruido si estás quieto)
      if (this.puntosTrayectoLibre.length > 0) {
        const ultimoPunto = this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1];
        const dist = ultimoPunto.distanceTo(latlng);
        
        if (dist < 2) return; // Si te has movido menos de 2 metros, no hagas nada
        this.distanciaAcumuladaTramo += dist;
      }

      this.puntosTrayectoLibre.push(latlng);
      this.actualizarMapaLibre(latlng);
      this.actualizarInfoTramoLibre();
    };

    // 1. El rastreador nativo (reacciona al movimiento)
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => procesarPosicion(pos),
      (err) => console.warn("Espera de señal GPS..."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    // 2. El "despertador" (fuerza la lectura cada 20 segundos por si el anterior se duerme)
    this.intervalRef = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => procesarPosicion(pos),
        null,
        { enableHighAccuracy: true }
      );
    }, 20000); // 20 segundos es un buen equilibrio entre fluidez y batería
  }

  detenerRastreo() {
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
    if (this.intervalRef) clearInterval(this.intervalRef); // <--- IMPORTANTE limpiar el intervalo
    this.watchId = null;
    this.isModoLibre = false;
  }

  actualizarMapaLibre(latlng: L.LatLng) {
    // Dibujar la línea azul por donde vamos pasando
    if (!this.polylineActual) {
      this.polylineActual = L.polyline(this.puntosTrayectoLibre, { color: '#3880ff', weight: 6 }).addTo(this.map);
      // Añadimos el primer marcador de inicio
      this.marcadores.push(L.marker(latlng).addTo(this.map));
    } else {
      this.polylineActual.setLatLngs(this.puntosTrayectoLibre);
    }
    this.map.panTo(latlng);
  }

  actualizarInfoTramoLibre() {
    const ahora = Date.now();
    const diffMinutos = Math.round((ahora - this.tiempoInicioTramo) / 60000);
    
    this.distancia = (this.distanciaAcumuladaTramo / 1000).toFixed(2) + ' km';
    this.duracion = diffMinutos + ' min';

    // Seteamos el objeto temporal para que "Confirmar Parada" funcione igual que antes
    this.datosTramoActual = {
      modo: this.tipoTransporte as any,
      coordenadas: this.puntosTrayectoLibre.map(p => [p.lng, p.lat]),
      distancia: this.distanciaAcumuladaTramo,
      duracion: (ahora - this.tiempoInicioTramo) / 1000 // segundos
    };
  }


  async presentarAlertaSiguientePaso() {
    // Detenemos el GPS momentáneamente para que no siga sumando distancia mientras el usuario decide
    if (this.watchId) navigator.geolocation.clearWatch(this.watchId);

    const alert = await this.alertController.create({
      header: '¡Parada Guardada!',
      subHeader: '¿Cómo vas a continuar el viaje?',
      backdropDismiss: false, // Obligamos a elegir una opción
      buttons: [
        {
          text: '🚗 En Coche',
          handler: () => { this.reiniciarTramoLibre('driving-car'); }
        },
        {
          text: '🚶 Andando',
          handler: () => { this.reiniciarTramoLibre('foot-walking'); }
        },
        {
          text: '🚲 En Bici',
          handler: () => { this.reiniciarTramoLibre('cycling-regular'); }
        },
        {
          text: '🏁 Finalizar Ruta',
          cssClass: 'alert-button-confirm',
          handler: () => { this.finalizarViaje(); }
        }
      ]
    });

    await alert.present();
  }

  private reiniciarTramoLibre(nuevoModo: string) {
    this.tipoTransporte = nuevoModo;
    
    // Limpiamos datos del tramo anterior pero mantenemos la línea en el mapa
    const ultimaPosicion = this.puntosTrayectoLibre[this.puntosTrayectoLibre.length - 1];
    this.puntosTrayectoLibre = [ultimaPosicion]; // El nuevo tramo empieza donde acabó el anterior
    this.distanciaAcumuladaTramo = 0;
    this.tiempoInicioTramo = Date.now();
    this.polylineActual = null; // Para que dibuje una línea nueva de este tramo

    // Volvemos a activar el GPS
    this.iniciarRastreo(); 
  }



  //Mostrar la ruta en el mapa
 cargarRutaGuardada(id: number) {
  console.log("1. Entrando en cargarRutaGuardada con ID:", id);
  this.limpiarMapa();

  this.RutasService.getParadasByRuta(id).subscribe({
    next: (paradas) => {
      console.log("2. Respuesta del backend recibida. Paradas:", paradas); // <--- LOG 2
      if (!paradas || paradas.length === 0) return;
      console.warn("3. Ojo: El backend no devolvió paradas para esta ruta.");

      // Forzamos ordenación por si el backend fallara en el OrderBy
      paradas.sort((a, b) => a.orden - b.orden);

      paradas.forEach((p, index) => {
        console.log(`4. Procesando marcador parada ${p.orden} en:`, p.latitud, p.longitud); // <--- LOG 3
        // 1. Dibujar el marcador de la parada
        const marcador = L.marker([p.latitud, p.longitud])
          .addTo(this.map)
          .bindPopup(`<b>Parada ${p.orden}</b><br>Transporte: ${p.tipoTransporte}`);
        this.marcadores.push(marcador);
        
        // 2. Pintar servicios guardados para esta parada
        this.dibujarServiciosCercanos(p.id);

        // 3. Dibujar el tramo hacia la SIGUIENTE parada
        if (index < paradas.length - 1) {
          console.log(`5. Pidiendo ruta a ORS para tramo entre ${p.orden} y ${index + 2}`); // <--- LOG 4
          const pSiguiente = paradas[index + 1];
          
          // Coordenadas para ORS: [Longitud, Latitud]
          const puntosTramo = [
            [p.longitud, p.latitud], 
            [pSiguiente.longitud, pSiguiente.latitud]
          ];

          // IMPORTANTE: Usamos el transporte de la parada DESTINO (pSiguiente)
          // porque es el que define cómo se llegó de p a pSiguiente
          const transporteORS = this.mapearTransporteORS(pSiguiente.tipoTransporte);

          this.RutasService.getRoute(puntosTramo, transporteORS).subscribe({
            next: (res) => {
              // Usamos el color según el transporte de la parada destino
              const colorTramo = this.obtenerColorPorTransporte(pSiguiente.tipoTransporte);
              
              L.geoJSON(res, {
                style: { color: colorTramo, weight: 6, opacity: 0.8 }
              }).addTo(this.map);
            },
            error: (err) => {
              console.error(`Error en tramo entre parada ${p.orden} y ${pSiguiente.orden}:`, err);
            }
          });
        }
      });

      // 4. Centrar el mapa con un margen (pad)
      setTimeout(() => {
        if (this.marcadores.length > 0) {
          const group = L.featureGroup(this.marcadores);
          this.map.fitBounds(group.getBounds().pad(0.2));
        }
      }, 1000); // Aumentamos un poco el tiempo para dar margen a la carga de rutas
    },
    error: (err) => console.error("Error cargando paradas del backend:", err)
  });
}

  // Función auxiliar para que ORS entienda tus tipos de transporte
 private mapearTransporteORS(tipo: any): string {
  if (!tipo) return 'foot-walking';
  const t = String(tipo).toLowerCase().trim(); // Forzamos a String por si viene el objeto Enum
  
  if (t === 'coche') return 'driving-car';
  if (t === 'bicicleta' || t === 'bici') return 'cycling-regular';
  return 'foot-walking';
}

    private obtenerColorPorTransporte(tipo: string): string {
    const t = tipo.toLowerCase();
    switch (t) {
      case 'coche':
        return '#3880ff'; // Azul
      case 'bicicleta':
        return '#ffa500'; // Naranja (puedes usar el hex exacto de tu CSS)
      case 'andando':
        return '#2dd36f'; // Verde
      default:
        return '#3880ff'; // Color por defecto
    }
  }
  
}