import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalDesignService);

  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;

  loginForm: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  });


  onSubmit(){
    this.modalService.openModal(this.twoFactorTemplate, 'md', 'Autenticación de Dos Factores');
    console.log(this.loginForm.value);
    console.log("slkdjflsd");
    // Redireccionar a una ruta
    //this.router.navigate(['/auth/verification']);
  }

  closeModal(){
    this.modalService.closeModal();
  }


}
