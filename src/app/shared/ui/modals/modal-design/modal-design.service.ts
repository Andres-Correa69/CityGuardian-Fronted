import { Injectable, TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalDesignComponent } from "./modal-design.component";

@Injectable({
  providedIn: "root",
})
export class ModalDesignService {
  constructor(private readonly modalService: NgbModal) {}

  openModal(content: TemplateRef<any>, size: string = "lg", title = "") {
    const modalRef = this.modalService.open(ModalDesignComponent, {
      size,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.data = {
      content,
      size,
      title,
    };

    modalRef.result.then((result) => {
      console.log(`Resultado: ${result}`);
    });

    return modalRef; // Asegúrate de retornar la referencia del modal
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeModalOne(modalRef: any) {
    if (modalRef) {
      modalRef.close();
    }
  }
}
