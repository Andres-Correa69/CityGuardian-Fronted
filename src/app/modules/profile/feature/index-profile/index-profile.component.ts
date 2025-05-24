import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../service/profile.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { User } from 'src/app/modules/auth/dto/loginResponse.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './index-profile.component.html',
  styleUrl: './index-profile.component.css'
})
export class IndexProfileComponent implements OnInit {
  @ViewChild('editProfileTemplate') editProfileTemplate!: TemplateRef<any>;

  private profileService = inject(ProfileService);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  profile: User | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
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
}

