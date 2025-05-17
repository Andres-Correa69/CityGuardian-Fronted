import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Aquí iría la lógica de registro
      console.log('Datos de registro:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }
}
