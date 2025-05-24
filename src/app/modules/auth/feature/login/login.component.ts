import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from 'src/app/shared/ui/loading/loader/loader.component';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule,LoaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);

  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;

  loginForm: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    // this.loaderService.showLoading();
  }


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
