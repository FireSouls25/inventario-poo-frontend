import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, NgIf],
  template: `
    <div style="max-width:600px; margin:0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ esEdicion() ? 'Editar' : 'Nuevo' }} Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-hint *ngIf="esEdicion()">Dejar en blanco para mantener la actual</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="rol">
                <mat-option value="ADMIN">Administrador</mat-option>
                <mat-option value="MESERO">Mesero</mat-option>
                <mat-option value="CHEF">Chef</mat-option>
              </mat-select>
            </mat-form-field>
            <div *ngIf="error()" style="background:#ffebee;color:#c62828;padding:8px 12px;border-radius:8px;font-size:13px;margin-bottom:12px;">{{ error() }}</div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button mat-button routerLink="/usuarios">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
                <mat-spinner *ngIf="loading()" diameter="18" style="display:inline-block;margin-right:6px;"></mat-spinner>
                {{ loading() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rol: ['', Validators.required],
  });

  readonly esEdicion = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.esEdicion.set(true);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.svc.buscarPorId(+id).subscribe(u => {
        this.form.patchValue({ nombre: u.nombre, email: u.email, rol: u.rol });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const id = this.route.snapshot.params['id'];
    const body = this.form.value as any;
    if (this.esEdicion() && !body.password) {
      delete body.password;
    }

    const obs = id
      ? this.svc.actualizar(+id, body)
      : this.svc.crear(body);

    obs.subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.mensaje || 'Error al guardar');
      },
    });
  }
}
