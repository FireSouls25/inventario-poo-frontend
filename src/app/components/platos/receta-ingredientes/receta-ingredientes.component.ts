import { Component, input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecetaService } from '../../../services/receta.service';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../core/models/producto.model';
import { IngredienteInfo } from '../../../core/models/plato.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-receta-ingredientes',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, NgIf, NgFor],
  template: `
    <div *ngIf="loading()"><mat-spinner diameter="30" /></div>

    <div *ngIf="!loading()">
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:16px; flex-wrap:wrap;">
        <mat-form-field appearance="outline" style="width:250px;">
          <mat-label>Producto</mat-label>
          <mat-select [formControl]="productoIdCtrl">
            <mat-option *ngFor="let p of productosDisponibles()" [value]="p.id">{{ p.nombre }} ({{ p.stockActual }} {{ p.unidad }})</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:150px;">
          <mat-label>Cantidad</mat-label>
          <input matInput type="number" step="0.001" [formControl]="cantidadCtrl">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="agregar()" [disabled]="!productoIdCtrl.value || !cantidadCtrl.value">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>

      <div *ngIf="error" style="color:red; margin-bottom:8px;">{{ error }}</div>

      <table mat-table [dataSource]="ingredientes()">
        <ng-container matColumnDef="productoNombre">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let i">{{ i.productoNombre }}</td>
        </ng-container>
        <ng-container matColumnDef="cantidad">
          <th mat-header-cell *matHeaderCellDef>Cantidad</th>
          <td mat-cell *matCellDef="let i">{{ i.cantidad }} {{ i.unidad }}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acción</th>
          <td mat-cell *matCellDef="let i">
            <button mat-icon-button color="warn" (click)="eliminar(i.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['productoNombre','cantidad','acciones']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['productoNombre','cantidad','acciones']"></tr>
      </table>

      <div *ngIf="ingredientes().length === 0" style="color:#666; margin-top:8px;">
        Este plato no tiene ingredientes. Agrega uno usando el formulario de arriba.
      </div>
    </div>
  `
})
export class RecetaIngredientesComponent implements OnInit {
  private recetaSvc = inject(RecetaService);
  private prodSvc = inject(ProductoService);
  private fb = inject(FormBuilder);

  readonly platoId = input.required<number>();
  readonly ingredientes = signal<IngredienteInfo[]>([]);
  readonly productosDisponibles = signal<Producto[]>([]);
  readonly loading = signal(false);
  error = '';

  productoIdCtrl = this.fb.control<number | null>(null, Validators.required);
  cantidadCtrl = this.fb.control<number | null>(null, Validators.required);

  ngOnInit(): void {
    this.prodSvc.listar().subscribe(res => this.productosDisponibles.set(res));
    this.cargarIngredientes();
  }

  cargarIngredientes(): void {
    this.loading.set(true);
    this.recetaSvc.listarIngredientes(this.platoId()).subscribe({
      next: res => { this.ingredientes.set(res); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  agregar(): void {
    if (!this.productoIdCtrl.value || !this.cantidadCtrl.value) return;
    this.error = '';
    this.recetaSvc.agregarIngrediente(this.platoId(), {
      productoId: this.productoIdCtrl.value,
      cantidad: this.cantidadCtrl.value,
    }).subscribe({
      next: () => {
        this.productoIdCtrl.reset();
        this.cantidadCtrl.reset();
        this.cargarIngredientes();
      },
      error: err => this.error = err.error?.mensaje || 'Error al agregar ingrediente',
    });
  }

  eliminar(itemId: number): void {
    this.recetaSvc.eliminarIngrediente(this.platoId(), itemId).subscribe({
      next: () => this.cargarIngredientes(),
      error: err => this.error = err.error?.mensaje || 'Error al eliminar ingrediente',
    });
  }
}
