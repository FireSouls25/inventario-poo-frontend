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
  selector: 'app-entrada-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, NgIf, NgFor],
  template: `
    <div style="max-width:600px; margin:0 auto;">
      <mat-card>
        <mat-card-header><mat-card-title>Registrar Entrada de Stock</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Producto</mat-label>
              <mat-select formControlName="productoId">
                <mat-option *ngFor="let p of productos()" [value]="p.id">{{ p.nombre }} ({{ p.stockActual }} {{ p.unidad }})</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" step="1" formControlName="cantidad">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Proveedor</mat-label>
              <input matInput formControlName="proveedor">
            </mat-form-field>
            <div *ngIf="error" style="color:red; margin-bottom:8px;">{{ error }}</div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button mat-button routerLink="/movimientos">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Registrando...' : 'Registrar Entrada' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class EntradaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movSvc = inject(MovimientoService);
  private prodSvc = inject(ProductoService);
  private router = inject(Router);

  productos = this.prodSvc.items;
  form = this.fb.group({
    productoId: ['', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(1)]],
    proveedor: [''],
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

    this.movSvc.registrarEntrada({
      productoId: +this.form.value.productoId!,
      cantidad: this.form.value.cantidad!,
      proveedor: this.form.value.proveedor!,
    }).subscribe({
      next: () => this.router.navigate(['/movimientos']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.mensaje || 'Error al registrar entrada';
      },
    });
  }
}
