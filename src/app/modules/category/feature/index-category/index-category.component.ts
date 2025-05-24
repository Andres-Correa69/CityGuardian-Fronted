import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDesignService } from 'src/app/shared/ui/modals/modal-design/modal-design.service';
import { LoaderService } from 'src/app/shared/ui/loading/loader/loader.service';
import { CategoryService, Category } from '../../service/category.service';

@Component({
  selector: 'app-index-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './index-category.component.html',
  styleUrl: './index-category.component.css'
})
export class IndexCategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalDesignService);
  private loaderService = inject(LoaderService);
  
  @ViewChild('createCategoryTemplate') createCategoryTemplate!: TemplateRef<any>;
  
  categories: Category[] = [];
  newCategory: Category = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loaderService.showLoading();
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.loaderService.hideLoading();
      }
    });
  }

  openCreateCategoryModal(): void {
    this.modalService.openModal(this.createCategoryTemplate, 'md', 'Crear Nueva Categoría');
  }

  createCategory(): void {
    this.loaderService.showLoading();
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (response) => {
        console.log('Categoría creada:', response);
        this.loadCategories();
        this.resetForm();
        this.modalService.closeModal();
        this.loaderService.hideLoading();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        this.loaderService.hideLoading();
      }
    });
  }

  private resetForm(): void {
    this.newCategory = {
      name: '',
      description: ''
    };
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
}
