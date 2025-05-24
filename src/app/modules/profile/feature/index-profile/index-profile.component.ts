import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../service/profile.service';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { User } from 'src/app/modules/auth/dto/loginResponse.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './index-profile.component.html',
  styleUrl: './index-profile.component.css'
})
export class IndexProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  profile: User | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      console.log(profile);
      this.profile = profile;
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Datos del perfil:', this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
