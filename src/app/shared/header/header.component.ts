import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, NgIf],
  template: `
    <header class="app-header">
      <div class="brand">
        <mat-icon class="brand-icon">restaurant_menu</mat-icon>
        <span>Restaurante</span>
      </div>

      <span class="spacer"></span>

      <div class="user-info" *ngIf="auth.usuario() as user">
        <span class="role-badge" [class]="'role-badge role-' + user.rol">
          {{ user.rol }}
        </span>
        <span style="color:#5a5550;font-size:14px;">{{ user.nombre }}</span>
        <button mat-icon-button (click)="logout()" matTooltip="Cerrar sesión" style="color:#5a5550;">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
