import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, NgIf],
  template: `
    <div style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:linear-gradient(135deg, #f4f2ef 0%, #e8e2da 100%);">
      <mat-card style="width:380px; padding:32px; text-align:center;">
        <mat-icon style="font-size:48px;width:48px;height:48px;color:#e65100;margin-bottom:8px;">restaurant_menu</mat-icon>
        <h2 style="margin:0 0 4px;font-weight:400;color:#3e3a36;">Restaurante</h2>
        <p style="margin:0 0 24px;color:#a09890;font-size:14px;">Sistema de Inventario</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="admin@restaurante.com">
            <mat-error *ngIf="form.get('email')?.hasError('required')">Email requerido</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Email inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password">
            <mat-error *ngIf="form.get('password')?.hasError('required')">Contraseña requerida</mat-error>
          </mat-form-field>

          <div *ngIf="error" style="background:#ffebee;color:#c62828;padding:8px 12px;border-radius:8px;font-size:13px;margin-bottom:12px;">{{ error }}</div>

          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading" style="width:100%;height:44px;font-size:15px;">
            <mat-spinner *ngIf="loading" diameter="20" style="display:inline-block; margin-right:8px;"></mat-spinner>
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <div style="margin-top:20px;">
          <a mat-button routerLink="/auth/register" style="color:#e65100;">¿No tenés cuenta? Registrate</a>
        </div>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  private homeRoute(): string {
    const rol = this.auth.rol();
    if (rol === 'ADMIN') return '/dashboard';
    if (rol === 'CHEF') return '/stock';
    return '/menu';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate([this.homeRoute()]),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.mensaje || 'Error al iniciar sesión';
      },
    });
  }
}
