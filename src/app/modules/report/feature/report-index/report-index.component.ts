import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MapService } from 'src/app/modules/map/service/map.service';

@Component({
  selector: 'app-report-index',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-index.component.html',
  styleUrl: './report-index.component.css'
})
export class ReportIndexComponent {
  private mapService = inject(MapService);
  private fb = inject(FormBuilder);

  modo: 'tabla' | 'mapa' = 'tabla';
  sidebarActive = false;

  crearReporteForm: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    direccion: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    evidencia: [null],
    ubicacion: [null, Validators.required]
  });

  ngOnInit(): void {
    this.mapService.crearMapa();
    this.mapService.agregarMarcador().subscribe((marcador) => {
      this.crearReporteForm.get('ubicacion')?.setValue({
        latitud: marcador.lat,
        longitud: marcador.lng,
      });
    });
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
    if (this.sidebarActive) {
      setTimeout(() => {
        this.mapService.mapa = null;
        this.mapService.crearMapaEnContenedor('modal-mapa');
        this.mapService.agregarMarcador().subscribe((marcador) => {
          this.crearReporteForm.get('ubicacion')?.setValue({
            latitud: marcador.lat,
            longitud: marcador.lng,
          });
        });
      }, 100);
    }
  }

  onSubmit() {
    if (this.crearReporteForm.valid) {
      // Aquí iría la lógica para crear el reporte
      console.log(this.crearReporteForm.value);
      this.toggleSidebar();
    } else {
      this.crearReporteForm.markAllAsTouched();
    }
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.crearReporteForm.get('ubicacion')?.setValue({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        });
        // Aquí podrías actualizar el mapa con la ubicación
      });
    }
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.crearReporteForm.get('evidencia')?.setValue(input.files[0]);
    }
  }
}
