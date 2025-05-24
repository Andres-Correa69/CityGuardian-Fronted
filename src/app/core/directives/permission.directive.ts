import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit {
  private hasView = false;
  private permission: string = '';

  @Input() set appPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.roleService.currentRole$.subscribe(() => {
      this.updateView();
    });
  }

  private updateView() {
    const hasPermission = this.roleService.hasPermission(this.permission as any);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
} 