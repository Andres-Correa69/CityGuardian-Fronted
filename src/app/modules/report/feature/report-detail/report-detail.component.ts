import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService, Report } from '../../service/report.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { MapService } from 'src/app/modules/map/service/map.service';
import { IReportResponse } from '../../dto/reportResponse.interface';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.css'
})
export class ReportDetailComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);
  private loaderService = inject(LoaderService);
  private mapService = inject(MapService);

  report: IReportResponse | null = null;

  ngOnInit(): void {
    this.loadReport();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializa después de cargar el reporte
    // Si el reporte ya está cargado, inicializa el mapa
    if (this.report && this.report.location) {
      this.initMap();
    }
  }

  loadReport(): void {
    this.loaderService.showLoading();
    const reportId = this.route.snapshot.paramMap.get('id');

    if (reportId) {
      this.reportService.getReportById(reportId).subscribe({
        next: (data) => {
          this.report = data;
          this.loaderService.hideLoading();
          setTimeout(() => this.initMap(), 100); // Espera a que el DOM esté listo
        },
        error: (error) => {
          console.error('Error al cargar el reporte:', error);
          this.loaderService.hideLoading();
          // Redirigir a la lista si hay error
          this.router.navigate(['/city-guardian/report/index']);
        }
      });
    }
  }

  initMap(): void {
    if (this.report && this.report.location) {
      const lat = parseFloat(this.report.location.latitude);
      const lng = parseFloat(this.report.location.longitude);
      this.mapService.crearMapaConMarcador('mapa-detalle', [lng, lat]);
    }
  }

  volver(): void {
    this.router.navigate(['/city-guardian/report/index']);
  }

  toggleImportant(): void {
    if (this.report) {
      const newImportantState = !this.report.important;
      this.reportService.markAsImportant(this.report.id, newImportantState).subscribe({
        next: () => {
          // Actualizar el estado local
          if (this.report) {
            this.report.important = newImportantState;
          }
          alert(this.report?.important ? 'Reporte marcado como importante' : 'Reporte desmarcado como importante');
        },
        error: (error) => {
          console.error('Error al cambiar el estado de importante:', error);
          alert('Error al cambiar el estado de importante');
        }
      });
    }
  }
}
