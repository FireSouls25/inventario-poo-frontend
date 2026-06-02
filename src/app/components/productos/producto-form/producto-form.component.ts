import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, NgIf],
  template: `
    <div style="max-width:600px; margin:0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ esEdicion ? 'Editar' : 'Nuevo' }} Producto</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
              <mat-error>Nombre requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Unidad de Medida</mat-label>
              <mat-select formControlName="unidad">
                <mat-option value="GRAMO">Gramo</mat-option>
                <mat-option value="LITRO">Litro</mat-option>
                <mat-option value="UNIDAD">Unidad</mat-option>
                <mat-option value="PIEZA">Pieza</mat-option>
              </mat-select>
              <mat-error>Unidad requerida</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Precio de Compra</mat-label>
              <input matInput type="number" step="0.01" formControlName="precioCompra">
              <mat-error>Precio requerido y debe ser positivo</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Stock Mínimo</mat-label>
              <input matInput type="number" step="0.001" formControlName="stockMinimo">
            </mat-form-field>

            <div *ngIf="error" style="color:red; margin-bottom:8px;">{{ error }}</div>

            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button mat-button routerLink="/productos">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nombre: ['', Validators.required],
    unidad: ['', Validators.required],
    precioCompra: [0, [Validators.required, Validators.min(0.01)]],
    stockMinimo: [0],
  });

  esEdicion = false;
  loading = false;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.esEdicion = true;
      this.svc.buscarPorId(+id).subscribe(p => this.form.patchValue(p));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const id = this.route.snapshot.params['id'];
    const obs = id
      ? this.svc.actualizar(+id, this.form.value as any)
      : this.svc.crear(this.form.value as any);

    obs.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.mensaje || 'Error al guardar';
      },
    });
  }
}
