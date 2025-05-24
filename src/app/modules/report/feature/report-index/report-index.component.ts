import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MapService } from 'src/app/modules/map/service/map.service';
import { ReportService, Report } from '../../service/report.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/modules/category/service/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-index',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-index.component.html',
  styleUrl: './report-index.component.css'
})
export class ReportIndexComponent implements OnInit {
  private mapService = inject(MapService);
  private reportService = inject(ReportService);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);
  private ngbModal = inject(NgbModal);
  private router = inject(Router);

  @ViewChild('createReportTemplate') createReportTemplate!: TemplateRef<any>;

  reports: Report[] = [];
  selectedImages: File[] = [];
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
    location: {
      latitude: '',
      longitude: ''
    }
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadReports();
  }

  loadCategories(): void {
    this.reportService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });
  }

  loadReports(): void {
    this.loaderService.showLoading();
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        console.error('Error al cargar reportes:', error);
        this.loaderService.hideLoading();
      }
    });
  }

  openCreateReportModal(): void {
    const modalRef = this.modalService.openModal(this.createReportTemplate, 'lg', 'Crear Nuevo Reporte');

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

  onFileSelected(event: any): void {
    this.selectedImages = Array.from(event.target.files);
  }

  createReport(): void {
    this.loaderService.showLoading();
    this.reportService.createReport(this.newReport, this.selectedImages).subscribe({
      next: (response) => {
        console.log('Reporte creado:', response);
        this.loadReports();
        this.resetForm();
        this.modalService.closeModal();
        this.loaderService.hideLoading();
      },
      error: (error) => {
        console.error('Error al crear reporte:', error);
        this.loaderService.hideLoading();
      }
    });
  }

  verDetalle(report: Report) {
    this.router.navigate(['/city-guardian/report/detail', report.id]);
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
      location: {
        latitude: '',
        longitude: ''
      }
    };
    this.selectedImages = [];
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
}
