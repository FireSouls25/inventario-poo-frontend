import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { ProductoService } from '../../../services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajuste-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, NgIf, NgFor],
  template: `
    <div style="max-width:600px; margin:0 auto;">
      <mat-card>
        <mat-card-header><mat-card-title>Realizar Ajuste de Stock</mat-card-title></mat-card-header>
        <mat-card-content>
          <p style="color:#666;">Usa valores positivos para aumentar stock, negativos para disminuir.</p>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Producto</mat-label>
              <mat-select formControlName="productoId">
                <mat-option *ngFor="let p of productos()" [value]="p.id">{{ p.nombre }} ({{ p.stockActual }} {{ p.unidad }})</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Cantidad (puede ser negativa)</mat-label>
              <input matInput type="number" step="0.001" formControlName="cantidad">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Motivo</mat-label>
              <input matInput formControlName="motivo">
            </mat-form-field>
            <div *ngIf="error" style="color:red; margin-bottom:8px;">{{ error }}</div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button mat-button routerLink="/movimientos">Cancelar</button>
              <button mat-raised-button color="accent" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Registrando...' : 'Registrar Ajuste' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class AjusteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movSvc = inject(MovimientoService);
  private prodSvc = inject(ProductoService);
  private router = inject(Router);

  productos = this.prodSvc.items;
  form = this.fb.group({
    productoId: ['', Validators.required],
    cantidad: [0, Validators.required],
    motivo: ['', Validators.required],
  });
  loading = false;
  error = '';

  ngOnInit(): void {
    this.prodSvc.listar().subscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.movSvc.registrarAjuste({
      productoId: +this.form.value.productoId!,
      cantidad: this.form.value.cantidad!,
      motivo: this.form.value.motivo!,
    }).subscribe({
      next: () => this.router.navigate(['/movimientos']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.mensaje || 'Error al registrar ajuste';
      },
    });
  }
}
