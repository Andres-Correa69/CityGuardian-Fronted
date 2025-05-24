import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChatbotComponent } from '../../ui/chatbot/chatbot.component';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

declare var $: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChatbotComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  isSidebarCollapsed = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  
  ngOnInit() {
    this.initializeSidebar();
  }

  logout() {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }

  initializeSidebar() {
    // Función para ajustar la altura
    const fullHeight = () => {
      $('.js-fullheight').css('height', $(window).height());
      $(window).resize(() => {
        $('.js-fullheight').css('height', $(window).height());
      });
    };

    fullHeight();

    // Manejar el toggle del sidebar
    $('#sidebarCollapse').on('click', () => {
      $('#sidebar').toggleClass('active');
    });
  }

  onSidebarStateChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  onToggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
