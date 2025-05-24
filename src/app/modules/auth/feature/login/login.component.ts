import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from 'src/app/shared/ui/loading/loader/loader.component';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { AuthService } from '../../service/auth.service';
import { ILoginResponse } from '../../dto/loginResponse.interface';
import { ILoginRequest } from '../../dto/LoginRequest.interface';
import { TokenService } from '@core/service/token.service';
import { RoleService, UserRole } from '@core/service/role.service';
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
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private roleService = inject(RoleService);

  loginForm: FormGroup;
  validateText: string = '';
  tempToken: string = '';
  tempUserRole:string = '';

  verificationForm: FormGroup;

  @ViewChild('activeaccountTemplate') activeaccountTemplate!: TemplateRef<any>;
  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;
  @ViewChild('validateTemplate') validateTemplate!: TemplateRef<any>;


  constructor() {
    this.loginForm = this.fb.group({
      email: ['gamez.guerra18@gmail.com', [Validators.required, Validators.email]],
      password: ['123456789', [Validators.required]]
    });

    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {
    
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const loginRequest: ILoginRequest = this.loginForm.value;
      this.loaderService.showLoading();
      
      this.authService.login(loginRequest).subscribe({
        next: (res: ILoginResponse) => {
          

          if(!res.user.isActive) {
            this.tempToken = res.token;
            this.tempUserRole = res.user.role;
            this.authService.sendActivationCode(res.token).subscribe({
              next: (res: any) => {
                this.loaderService.hideLoading();
                this.modalService.openModal(this.activeaccountTemplate, 'md', 'Tu cuenta no esta activa');
              },
              error: (err: any) => {
                this.authService.clearSession();
                this.clearSessionGlobal();
                this.loaderService.hideLoading();
              }
            });
            return;
          }

          this.loaderService.hideLoading();

          this.tokenService.setToken(res.token);
          this.roleService.setRole(res.user.role as UserRole);
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

  initLogin() {
    this.tokenService.setToken(this.tempToken);
    this.roleService.setRole(this.tempUserRole as UserRole);
    //this.roleService.setRole('ADMIN');
    this.router.navigate(['/city-guardian/dashboard']);
  }

 clearSessionGlobal(){
    this.authService.clearSession();
    this.tempToken = '';
    this.tempUserRole = '';
  }

  closeModal() {
    this.modalService.closeModal();
  }

  validateActivationCode() {
    if (this.verificationForm.valid) {
      const code = this.verificationForm.get('code')?.value;
      console.log('Código de verificación:', code);
      console.log('Token:', this.tempToken);
      this.loaderService.showLoading();
      this.authService.validateActivationCode(this.tempToken, code).subscribe({
        next: (response: any) => {
          this.loaderService.hideLoading();
          console.log('Código validado:', response);
          this.modalService.closeModal();
          this.initLogin();
        },
        error: (error: any) => {
          this.verificationForm.get('code')?.setValue('');
          this.loaderService.hideLoading();
          this.authService.clearSession();
          this.clearSessionGlobal();
          this.validateText = error.message || 'Error al validar código';
          this.modalService.openModal(this.validateTemplate, 'md', 'Error al validar código');
        }
      });

    }
  }
}