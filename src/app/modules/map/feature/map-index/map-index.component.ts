import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../../service/map.service';
import { ReportService } from '../../../report/service/report.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-index.component.html',
  styleUrl: './map-index.component.css'
})
export class MapIndexComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private reportService = inject(ReportService);
  private router = inject(Router);

  ngOnInit(): void {
    this.mapService.crearMapa();
    this.mapService.mapa.on('load', () => {
      this.loadReports();
    });

    // Escuchar el evento personalizado de clic en marcadores
    window.addEventListener('markerClick', ((event: CustomEvent) => {
      const reportId = event.detail.reportId;
      console.log('Navegando al reporte:', reportId);
      this.router.navigate(['/city-guardian/report/detail', reportId]);
    }) as EventListener);

    // Escuchar el evento de marcar como importante
    window.addEventListener('markAsImportant', ((event: CustomEvent) => {
      const reportId = event.detail.reportId;
      this.markAsImportant(reportId);
    }) as EventListener);
  }

  ngOnDestroy(): void {
    // Limpiar los eventos cuando el componente se destruye
    window.removeEventListener('markerClick', ((event: CustomEvent) => {
      const reportId = event.detail.reportId;
      this.router.navigate(['/city-guardian/report/detail', reportId]);
    }) as EventListener);

    window.removeEventListener('markAsImportant', ((event: CustomEvent) => {
      const reportId = event.detail.reportId;
      this.markAsImportant(reportId);
    }) as EventListener);
  }

  private loadReports() {
    this.reportService.getReports().subscribe({
      next: (reports) => {

        // Pintar los marcadores en el mapa
        this.mapService.pintarMarcadores(reports);

        // Cambiar el cursor al pasar sobre los marcadores
        this.mapService.mapa.on('mouseenter', () => {
          this.mapService.mapa.getCanvas().style.cursor = 'pointer';
        });

        this.mapService.mapa.on('mouseleave', () => {
          this.mapService.mapa.getCanvas().style.cursor = '';
        });
      },
      error: (error) => {
        console.error('Error loading reports:', error);
      }
    });
  }

  markAsImportant(reportId: string) {
    this.reportService.markAsImportant(reportId).subscribe({
      next: () => {
        // Recargar los reportes para actualizar el estado
        this.loadReports();
      },
      error: (error) => {
        console.error('Error al marcar como importante:', error);
        alert('Error al marcar como importante');
      }
    });
  }
}
