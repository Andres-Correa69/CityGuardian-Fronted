import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-activation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './account-activation.component.html',
  styleUrl: './account-activation.component.css'
})
export class AccountActivationComponent {
  activationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.activationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.activationForm.valid) {
      // Aquí iría la lógica de activación
      console.log('Datos de activación:', this.activationForm.value);
    } else {
      this.activationForm.markAllAsTouched();
    }
  }
}
