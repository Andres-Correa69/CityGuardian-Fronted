import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent  {
  currentYear: number = new Date().getFullYear();

  constructor() { }



  
}
