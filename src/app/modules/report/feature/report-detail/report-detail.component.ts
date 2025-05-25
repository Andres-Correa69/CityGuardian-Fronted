import { Component, OnInit, inject, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService, Report, ReportRequest } from '../../service/report.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { MapService } from 'src/app/modules/map/service/map.service';
import { Category, IReportResponse } from '../../dto/reportResponse.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RoleService } from '@core/service/role.service';
import { ProfileService } from 'src/app/modules/profile/service/profile.service';
import { User } from 'src/app/modules/auth/dto/loginResponse.interface';
import { LoaderComponent } from "../../../../shared/ui/loading/loader/loader.component";
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.css'
})
export class ReportDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('editReportTemplate') editReportTemplate!: TemplateRef<any>;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private reportService = inject(ReportService);
  private loaderService = inject(LoaderService);
  private profileService = inject(ProfileService);
  private mapService = inject(MapService);
  public modalService = inject(NgbModal);
  private modalDesignService = inject(ModalDesignService);

  report: IReportResponse | null = null;
  selectedImages: File[] = [];
  rejectReason: string = '';
  mostrandoReportesCercanos = false;
  mostrandoZonasRiesgo = false;
  isClient = false;
  profile: User | null = null;
  categories: Category[] = [];

  newReport: Report = {
    id: '',
    title: '',
    description: '',
    status: 'CREATED',
    category: {
      id: '',
      name: '',
      description: ''
    },
    imageUrls: [],
    location: null
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadReport();
    this.isClient = this.roleService.isClient();
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      }
    });
  }

  loadCategories(): void {
    this.reportService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedImages = Array.from(event.target.files);
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializa después de cargar el reporte
    // Si el reporte ya está cargado, inicializa el mapa
    if (this.report && this.report.location) {
      this.initMap();
    }
  }

  showVerifyButton(): boolean {
    return this.roleService.isAdmin() && this.report?.status === 'CREATED';
  }

  showRejectButton(): boolean {
    return this.roleService.isAdmin() && this.report?.status !== 'VERIFIED' && this.report?.status !== 'RESOLVED';
  }

  showResolveButton(): boolean {
    return (this.roleService.isAdmin() && this.report?.status === 'VERIFIED') || this.roleService.isClient();
  }

  showReviewButton(): boolean {
    return this.roleService.isClient() && this.report?.status === 'REJECTED';
  }

  showEditButton(): boolean {
    return this.isClient && this.profile?.id === this.report?.userId;
  }

  editReport(): void {
    const modalRef = this.modalDesignService.openModal(this.editReportTemplate, 'lg', 'Editar Reporte');

    // Esperamos a que el modal esté completamente abierto
    modalRef.shown.subscribe(() => {
      // Inicializamos el mapa después de que el modal esté visible
      setTimeout(() => {
        this.mapService.crearMapa();
        this.mapService.agregarMarcador().subscribe((marcador) => {
          
          this.newReport.location = {
            latitude: marcador.lat.toString(),
            longitude: marcador.lng.toString()
          }
        });
      }, 100);
    });
  }

  getTranslationOfStatus(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'Creado';
      case 'VERIFIED':
        return 'Verificado';
      case 'RESOLVED':
        return 'Resuelto';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return status;
    }
  }

  private resetForm(): void {
    this.newReport = {
      id: '',
      title: '',
      description: '',
      status: 'CREATED',
      category: {
        id: '',
        name: '',
        description: ''
      },
      imageUrls: [],
      location: null
    };
    this.selectedImages = [];
  }

  loadReport(): void {
    this.loaderService.showLoading();
    const reportId = this.route.snapshot.paramMap.get('id');

    if (reportId) {
      this.reportService.getReportById(reportId).subscribe({
        next: (data) => {
          this.report = data;
          this.loaderService.hideLoading();
          this.newReport = structuredClone(data);
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
          if (this.report) {
            this.report.important = newImportantState;
          }
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

  upadteReport(): void {
    this.loaderService.showLoading();
    if (!this.report) {
      return;
    }
    const reportRequest: ReportRequest = {
      title: this.newReport.title,
      description: this.newReport.description,
      categoryId: this.newReport.category.id,
      status: this.newReport.status,
      imageUrls: this.newReport.imageUrls,
      location: this.newReport.location
    };
    this.reportService.updateReport(this.report.id, reportRequest, this.selectedImages).subscribe({
      next: (response) => {
        console.log('Reporte actualizado:', response);
        this.loadReport();
        this.loaderService.hideLoading();
        this.modalDesignService.closeModal();
      },
      error: (error) => {
        this.loaderService.hideLoading();
      }
    });
  }
}
