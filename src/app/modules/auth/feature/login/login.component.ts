import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from 'src/app/shared/ui/loading/loader/loader.component';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { ServicesService } from '../../service/services.service';
import { ILoginResponse } from '../../dto/loginResponse.interface';
import { ILoginRequest } from '../../dto/LoginRequest.interface';
import { TokenService } from '@core/service/token.service';


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
  private serviceAuth = inject(ServicesService);
  private tokenService = inject(TokenService);

  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;

  loginForm: FormGroup = this.fb.group({
    email: ['juan.pereddz@example.com', Validators.required,Validators.email],
    password: ['MiClave123', Validators.required]
  });

  ngOnInit(): void {
    // this.loaderService.showLoading();
  }

  onSubmit(){
   // this.modalService.openModal(this.twoFactorTemplate, 'md', 'Autenticación de Dos Factores');

    const loginRequest: ILoginRequest = this.loginForm.value;
    console.log(loginRequest);
    this.loaderService.showLoading();
    
    this.serviceAuth.login(loginRequest).subscribe({
      next: (res: ILoginResponse) => {
        console.log(res);
        this.loaderService.hideLoading();
        this.tokenService.setToken(res.token);
        this.router.navigate(['/city-guardian/dashboard']);
      },
      error: (err: any) => {
        console.log(err);
        this.loaderService.hideLoading();
      }
    })
  
    // Redireccionar a una ruta
    //this.router.navigate(['/auth/verification']);
  }

  closeModal(){
    this.modalService.closeModal();
  }


}
