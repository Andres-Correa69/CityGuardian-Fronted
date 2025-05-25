import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService, Report } from '../../service/report.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { MapService } from 'src/app/modules/map/service/map.service';
import { IReportResponse } from '../../dto/reportResponse.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.css'
})
export class ReportDetailComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);
  private loaderService = inject(LoaderService);
  private mapService = inject(MapService);
  public modalService = inject(NgbModal);

  report: IReportResponse | null = null;
  rejectReason: string = '';
  mostrandoReportesCercanos = false;
  mostrandoZonasRiesgo = false;

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
      const lat = this.report.location.latitude;
      const lng = this.report.location.longitude;
      this.mapService.crearMapaConMarcador('mapa-detalle', [lng, lat]);
    }
  }

  mostrarReportesCercanos(): void {
    if (this.report && this.report.location) {
      this.mostrandoReportesCercanos = true;
      this.mostrandoZonasRiesgo = false;
      this.mapService.limpiarZonasAltoRiesgo();

      this.reportService.getReportesCercanos(
        this.report.location.latitude,
        this.report.location.longitude
      ).subscribe({
        next: (reportes) => {
          if (Array.isArray(reportes) && reportes.length > 0) {
            this.mapService.mostrarReportesCercanos(reportes);
          } else {
            alert('No se encontraron reportes cercanos');
            this.mostrandoReportesCercanos = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener reportes cercanos:', error);
          alert('Error al obtener los reportes cercanos');
          this.mostrandoReportesCercanos = false;
        }
      });
    }
  }

  mostrarZonasAltoRiesgo(): void {
    if (this.report && this.report.location) {
      this.mostrandoZonasRiesgo = true;

      this.reportService.getReportesCercanos(
        this.report.location.latitude,
        this.report.location.longitude
      ).subscribe({
        next: (reportes) => {
          if (Array.isArray(reportes) && reportes.length > 0) {
            this.mapService.mostrarZonasAltoRiesgo(reportes);
          } else {
            alert('No se encontraron reportes para mostrar zonas de riesgo');
            this.mostrandoZonasRiesgo = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener zonas de riesgo:', error);
          alert('Error al obtener las zonas de riesgo');
          this.mostrandoZonasRiesgo = false;
        }
      });
    }
  }

  volverAMapaOriginal(): void {
    this.mostrandoReportesCercanos = false;
    this.mostrandoZonasRiesgo = false;
    this.mapService.volverAMapaOriginal();
    this.initMap();
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

  verifyReport(): void {
    if (this.report) {
      this.loaderService.showLoading();
      this.reportService.verifyReport(this.report.id).subscribe({
        next: () => {
          this.loadReport();
          alert('Reporte verificado exitosamente');
        },
        error: (error) => {
          console.error('Error al verificar el reporte:', error);
          alert('Error al verificar el reporte');
          this.loaderService.hideLoading();
        }
      });
    }
  }

  openRejectModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  rejectReport(): void {
    if (this.report && this.rejectReason.trim()) {
      this.loaderService.showLoading();
      this.reportService.rejectReport(this.report.id, this.rejectReason).subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.loadReport();
          this.rejectReason = '';
          alert('Reporte rechazado exitosamente');
        },
        error: (error) => {
          console.error('Error al rechazar el reporte:', error);
          alert('Error al rechazar el reporte');
          this.loaderService.hideLoading();
        }
      });
    } else {
      alert('Por favor, ingrese un motivo para el rechazo');
    }
  }

  resolveReport(): void {
    if (this.report) {
      this.loaderService.showLoading();
      this.reportService.resolveReport(this.report.id).subscribe({
        next: () => {
          this.loadReport();
          alert('Reporte resuelto exitosamente');
        },
        error: (error) => {
          console.error('Error al resolver el reporte:', error);
          alert('Error al resolver el reporte');
          this.loaderService.hideLoading();
        }
      });
    }
  }

  reviewReport(): void {
    if (this.report) {
      this.loaderService.showLoading();
      this.reportService.reviewReport(this.report.id).subscribe({
        next: () => {
          this.loadReport();
          alert('Reporte enviado a revisión exitosamente');
        },
        error: (error) => {
          console.error('Error al enviar el reporte a revisión:', error);
          alert('Error al enviar el reporte a revisión');
          this.loaderService.hideLoading();
        }
      });
    }
  }

  isButtonDisabled(status: string): boolean {
    return this.report?.status === status;
  }
}
