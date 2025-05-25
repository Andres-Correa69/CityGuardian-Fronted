import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { ReporteDTO } from '../model/reporte.dto';
import { Report } from '../../report/service/report.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  mapa: any;
  marcadores: any[];
  posicionActual: LngLatLike;


  constructor() {
    this.marcadores = [];
    this.posicionActual = [-75.67270, 4.53252];
  }


  public crearMapa() {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZ2FtZXo5ODE0IiwiYSI6ImNtYXJzdG4wajBhZ3YybW9sdzYyaG5mODQifQ.mRSSFs2sf9keiygC-J-0_Q',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/standard',
      center: this.posicionActual,
      pitch: 45,
      zoom: 17
    });


    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );


  }


  public agregarMarcador(): Observable<any> {
    const mapaGlobal = this.mapa;
    const marcadores = this.marcadores;


    return new Observable<any>(observer => {


      mapaGlobal.on('click', function (e: any) {
        marcadores.forEach(marcador => marcador.remove());


        const marcador = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(mapaGlobal);


        marcadores.push(marcador);
        observer.next(marcador.getLngLat());
      });
    });


  }


  public pintarMarcadores(reportes: Report[]) {
    reportes.forEach(reporte => {
      // Determinar el color del marcador basado en si es importante
      const markerColor = reporte.important ? 'yellow' : 'red';

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([reporte.location!.longitude, reporte.location!.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3>${reporte.title}</h3>
            <p>${reporte.description}</p>
            ${reporte.important ? '<p style="color: gold;">⭐ Importante</p>' : ''}
            <button onclick="window.dispatchEvent(new CustomEvent('markAsImportant', { detail: { reportId: '${reporte.id}' } }))" 
                    style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">
              ${reporte.important ? '⭐ Ya es importante' : '⭐ Marcar como importante'}
            </button>
          </div>
        `));

      // Agregar el evento de clic al marcador
      marker.getElement().addEventListener('click', () => {
        console.log('Marcador clickeado:', reporte.id);
        // Disparar un evento personalizado con el ID del reporte
        const event = new CustomEvent('markerClick', { detail: { reportId: reporte.id } });
        window.dispatchEvent(event);
      });

      marker.addTo(this.mapa);

    });
  }

  public crearMapaPersonalizado(containerId: string, center: [number, number]) {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZ2FtZXo5ODE0IiwiYSI6ImNtYXJzdG4wajBhZ3YybW9sdzYyaG5mODQifQ.mRSSFs2sf9keiygC-J-0_Q',
      container: containerId,
      style: 'mapbox://styles/mapbox/standard',
      center: center,
      pitch: 45,
      zoom: 17
    });

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );
  }

  public crearMapaConMarcador(containerId: string, center: [number, number]) {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZ2FtZXo5ODE0IiwiYSI6ImNtYXJzdG4wajBhZ3YybW9sdzYyaG5mODQifQ.mRSSFs2sf9keiygC-J-0_Q',
      container: containerId,
      style: 'mapbox://styles/mapbox/standard',
      center: center,
      pitch: 45,
      zoom: 17
    });

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );

    // Agrega el marcador
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(center)
      .addTo(this.mapa);
  }

  public mostrarReportesCercanos(reportes: Report[]) {
    // Limpiar marcadores existentes
    this.marcadores.forEach(marcador => marcador.remove());
    this.marcadores = [];

    // Agregar nuevos marcadores
    reportes.forEach(reporte => {
      if (reporte.location) {
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([reporte.location.longitude, reporte.location.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(reporte.title));

        marker.getElement().addEventListener('click', () => {
          console.log('Marcador clickeado:', reporte.id);
          const event = new CustomEvent('markerClick', { detail: { reportId: reporte.id } });
          window.dispatchEvent(event);
        });

        marker.addTo(this.mapa);
        this.marcadores.push(marker);
      }
    });

    // Ajustar la vista del mapa para mostrar todos los marcadores
    if (reportes.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      reportes.forEach(reporte => {
        if (reporte.location) {
          bounds.extend([reporte.location.longitude, reporte.location.latitude]);
        }
      });
      this.mapa.fitBounds(bounds, { padding: 50 });
    }
  }

  public mostrarZonasAltoRiesgo(reportes: Report[]) {
    // Filtrar reportes con ubicación válida
    const reportesConUbicacion = reportes.filter(
      reporte => reporte.location && reporte.location.longitude && reporte.location.latitude
    );

    if (reportesConUbicacion.length < 3) {
      alert('Se necesitan al menos 3 reportes para crear una zona de riesgo');
      return;
    }

    // Crear un array de coordenadas para el polígono
    const coordinates = reportesConUbicacion.map(reporte => [
      reporte.location!.longitude,
      reporte.location!.latitude
    ]);

    // Cerrar el polígono
    coordinates.push(coordinates[0]);

    // Limpiar capas existentes
    this.limpiarZonasAltoRiesgo();

    // Agregar el polígono al mapa
    this.mapa.addSource('zona-riesgo', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      }
    });

    this.mapa.addLayer({
      id: 'zona-riesgo-layer',
      type: 'fill',
      source: 'zona-riesgo',
      layout: {},
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.3
      }
    });

    // Ajustar la vista del mapa para mostrar todo el polígono
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => {
      bounds.extend([coord[0], coord[1]]);
    });
    this.mapa.fitBounds(bounds, { padding: 50 });
  }

  public limpiarZonasAltoRiesgo() {
    if (this.mapa.getLayer('zona-riesgo-layer')) {
      this.mapa.removeLayer('zona-riesgo-layer');
    }
    if (this.mapa.getSource('zona-riesgo')) {
      this.mapa.removeSource('zona-riesgo');
    }
  }

  public volverAMapaOriginal() {
    // Limpiar marcadores
    this.marcadores.forEach(marcador => marcador.remove());
    this.marcadores = [];

    // Limpiar zonas de riesgo
    this.limpiarZonasAltoRiesgo();

    // Volver a la vista original
    if (this.posicionActual) {
      this.mapa.flyTo({
        center: this.posicionActual,
        zoom: 17,
        essential: true
      });
    }
  }
}
