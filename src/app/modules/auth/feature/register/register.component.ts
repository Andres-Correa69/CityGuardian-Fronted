import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../../../core/service/alert.service';
import { SweetAlertResult } from 'sweetalert2';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private loaderService = inject(LoaderService);
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loaderService.showLoading();
      const registerData = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          this.alertService.successTimer(
            '¡Registro exitoso!',
            'Serás redirigido al inicio de sesión',
            2000
          ).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        error: (error) => {
          console.log(error);
          this.loaderService.hideLoading();
          this.alertService.error(  
            'Error en el registro',
            error || 'Error al registrar usuario'
          );
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.alertService.warning(
        'Formulario incompleto',
        'Por favor, complete todos los campos correctamente'
      );
    }
  }

  onCancel() {
    this.alertService.confirm(
      '¿Estás seguro?',
      'Se perderán los datos ingresados'
    ).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  // Getters para acceder a los controles del formulario
  get name() { return this.registerForm.get('name'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get phone() { return this.registerForm.get('phone'); }
  get city() { return this.registerForm.get('city'); }
  get address() { return this.registerForm.get('address'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
