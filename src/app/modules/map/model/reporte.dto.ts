export interface UbicacionDTO {
  longitud: number;
  latitud: number;
}

export interface ReporteDTO {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: UbicacionDTO;
  fecha: Date;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO';
  tipo: string;
  usuarioId: string;
  important?: boolean;
} 