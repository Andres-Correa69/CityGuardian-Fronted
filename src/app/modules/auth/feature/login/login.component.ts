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
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LoaderComponent],
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

  loginForm: FormGroup;
  validateText: string = '';

  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;
  @ViewChild('validateTemplate') validateTemplate!: TemplateRef<any>;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginRequest: ILoginRequest = this.loginForm.value;
      this.loaderService.showLoading();
      
      this.serviceAuth.login(loginRequest).subscribe({
        next: (res: ILoginResponse) => {
          this.loaderService.hideLoading();
          this.tokenService.setToken(res.token);
          this.router.navigate(['/city-guardian/dashboard']);
        },
        error: (err: any) => {
          console.log('Error en el login');
          console.log(err);
          this.loaderService.hideLoading();
          this.validateText = err || 'Error al iniciar sesión';
          this.modalService.openModal(this.validateTemplate, 'md', 'Error al iniciar sesión');
        }
      });
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }
}