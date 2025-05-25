import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../service/profile.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { User } from 'src/app/modules/auth/dto/loginResponse.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './index-profile.component.html',
  styleUrl: './index-profile.component.css'
})
export class IndexProfileComponent implements OnInit {
  @ViewChild('editProfileTemplate') editProfileTemplate!: TemplateRef<any>;
  @ViewChild('twoFactorTemplate') twoFactorTemplate!: TemplateRef<any>;
  @ViewChild('validateTemplate') validateTemplate!: TemplateRef<any>;
  @ViewChild('changePasswordTemplate') changePasswordTemplate!: TemplateRef<any>;
  @ViewChild('newPasswordTemplate') newPasswordTemplate!: TemplateRef<any>;
  @ViewChild('changePasswordCodeTemplate') changePasswordCodeTemplate!: TemplateRef<any>;
  @ViewChild('deleteAccountTemplate') deleteAccountTemplate!: TemplateRef<any>;

  private router = inject(Router);
  private profileService = inject(ProfileService);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);
  private authService = inject(AuthService);

  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  profile: User | null = null;
  newPasswordForm: FormGroup;
  resetCodeForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  validateText: string = '';

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.resetCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loaderService.showLoading();
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.loaderService.hideLoading();
      }
    });
  }

  openEditProfileModal(): void {
    // Inicializar el formulario con los datos actuales
    this.profileForm.patchValue({
      name: this.profile?.name,
      lastName: this.profile?.lastName,
      phone: this.profile?.phone,
      city: this.profile?.city,
      address: this.profile?.address
    });

    this.modalService.openModal(this.editProfileTemplate, 'md', 'Editar Perfil');
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loaderService.showLoading();
      const updateData = {
        name: this.profileForm.get('name')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        phone: this.profileForm.get('phone')?.value,
        city: this.profileForm.get('city')?.value,
        address: this.profileForm.get('address')?.value
      };

      this.profileService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.loadProfile();
          this.modalService.closeModal();
          this.loaderService.hideLoading();
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.loaderService.hideLoading();
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  deleteAccount(): void {
    this.modalService.openModal(this.deleteAccountTemplate, 'md', 'Confirmar eliminación');
  }

  confirmDeleteAccount(): void {
    this.loaderService.showLoading();
    this.profileService.deleteProfile().subscribe({
      next: () => {
        this.loaderService.hideLoading();
        this.modalService.closeModal();
        this.validateText = 'Cuenta eliminada exitosamente';
        this.modalService.openModal(this.validateTemplate, 'md', 'Éxito');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.validateText = error.message || 'Error al eliminar la cuenta';
        this.modalService.openModal(this.validateTemplate, 'md', 'Error');
      }
    });
  }

  recoverPassword(): void {
    if (!this.profile?.email) {
      return;
    }
    this.loaderService.showLoading();
    this.authService.sendResetPasswordCode(this.profile?.email).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.modalService.openModal(this.changePasswordCodeTemplate, 'md', 'Código de verificación');
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.modalService.openModal(this.validateTemplate, 'md', 'Error');
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onNewPasswordSubmit() {
    console.log('onNewPasswordSubmit');
    console.log(this.newPasswordForm.value);
    console.log(this.profile?.email);

    if (this.newPasswordForm.valid) {
      const newPassword = this.newPasswordForm.get('newPassword')?.value;
      this.loaderService.showLoading();

      this.authService.changePassword({ email: this.profile?.email ?? '', newPassword }).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          this.modalService.closeModal();
          this.validateText = 'Contraseña actualizada exitosamente';
          this.modalService.openModal(this.validateTemplate, 'md', 'Éxito');
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.validateText = error.message || 'Error al cambiar la contraseña';
          this.modalService.openModal(this.validateTemplate, 'md', 'Error');
        }
      });
    }
  }

  onResetPasswordSubmit() {
    this.loaderService.showLoading();

    this.authService.sendResetPasswordCode(this.profile?.email ?? '').subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.modalService.closeModal();
        this.modalService.openModal(this.changePasswordCodeTemplate, 'md', 'Código de verificación');
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.validateText = error.message || 'Error al enviar el código';
        this.modalService.openModal(this.validateTemplate, 'md', 'Error');
      }
    });
  }

  onResetCodeSubmit() {
    if (this.resetCodeForm.valid) {
      const code = this.resetCodeForm.get('code')?.value;
      this.loaderService.showLoading();

      this.authService.validateResetCode(this.profile?.email ?? '', code).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          this.modalService.closeModal();
          this.modalService.openModal(this.newPasswordTemplate, 'md', 'Nueva contraseña');
          this.resetCodeForm.reset();
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.validateText = error.message || 'Error al validar el código';
          this.modalService.openModal(this.validateTemplate, 'md', 'Error');
          this.resetCodeForm.reset();
        }
      });
    }
  }
}

