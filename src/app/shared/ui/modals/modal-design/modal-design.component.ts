import { Component, Input,TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-design',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-design.component.html',
  styleUrls: ['./modal-design.component.css']
})
export class ModalDesignComponent {
  @Input()
  data!: {
    content: TemplateRef<any>;
    size: string; 
    title: string;
  };

  constructor(public activeModal: NgbActiveModal) {
    // No accedemos a this.data en el constructor ya que aún no está inicializado
  }

  confirm() {
    this.activeModal.close("¡Confirmado!");
  }
}
