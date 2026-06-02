import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OpcionMenuService } from '../../services/opcion-menu.service';
import { OpcionMenu } from '../../core/models/opcion-menu.model';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, NgFor, NgIf],
  template: `
    <nav class="sidebar">
      <ng-container *ngFor="let item of menuItems()">
        <ng-container *ngIf="!item.ruta">
          <div class="sidebar-section-title"><span class="label">{{ item.nombre }}</span></div>
          <ng-container *ngFor="let sub of item.hijos">
            <a class="sidebar-item"
               [routerLink]="sub.ruta!"
               routerLinkActive="active-link"
               [routerLinkActiveOptions]="{exact: sub.ruta === '/dashboard'}"
               *ngIf="tieneRol(sub.roles)">
              <mat-icon>{{ sub.icono }}</mat-icon>
              <span class="label">{{ sub.nombre }}</span>
            </a>
          </ng-container>
        </ng-container>
      </ng-container>
    </nav>
  `
})
export class SidebarComponent implements OnInit {
  private auth = inject(AuthService);
  private menuSvc = inject(OpcionMenuService);

  readonly menuItems = signal<OpcionMenu[]>([]);

  ngOnInit(): void {
    const rol = this.auth.rol();
    if (rol) {
      this.menuSvc.obtenerMenu(rol).subscribe({
        next: res => this.menuItems.set(res),
      });
    }
  }

  tieneRol(roles: string): boolean {
    const userRol = this.auth.rol();
    if (!userRol || !roles) return false;
    return roles.split(',').map(r => r.trim()).includes(userRol);
  }
}
