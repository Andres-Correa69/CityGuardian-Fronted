import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  isSidebarCollapsed = false;

  ngOnInit() {
    this.initializeSidebar();
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
