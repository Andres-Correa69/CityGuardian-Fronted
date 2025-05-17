import { Component, inject } from '@angular/core';
import { MapService } from 'src/app/modules/map/service/map.service';

@Component({
  selector: 'app-report-index',
  imports: [],
  templateUrl: './report-index.component.html',
  styleUrl: './report-index.component.css'
})
export class ReportIndexComponent {
  private mapService = inject(MapService);
  ngOnInit(): void {
    this.mapService.crearMapa();
   
   
    this.mapService.agregarMarcador().subscribe((marcador) => {

      console.log(marcador.lat);
      console.log(marcador.lng);
      
      /*
      this.crearReporteForm.get('ubicacion')?.setValue({
        latitud: marcador.lat,
        longitud: marcador.lng,
      });
      */
    });
   
   
   }
   
}
