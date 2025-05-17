import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../service/map.service';

@Component({
  selector: 'app-map-index',
  imports: [],
  templateUrl: './map-index.component.html',
  styleUrl: './map-index.component.css'
})
export class MapIndexComponent implements OnInit {
  private mapService = inject(MapService);
  

 ngOnInit(): void {
  this.mapService.crearMapa();
}

}
