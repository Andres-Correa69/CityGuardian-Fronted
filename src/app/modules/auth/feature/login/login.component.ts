import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  });


  onSubmit(){

    console.log(this.loginForm.value);
    console.log("slkdjflsd");
    // Redireccionar a una ruta
    this.router.navigate(['/auth/verification']);
  }


}
