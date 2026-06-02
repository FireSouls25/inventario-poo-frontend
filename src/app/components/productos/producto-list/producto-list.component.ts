import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../core/models/producto.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgIf],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h1>Productos</h1>
      <button mat-raised-button color="primary" routerLink="/productos/nuevo">
        <mat-icon>add</mat-icon> Nuevo Producto
      </button>
    </div>

    <div *ngIf="svc.loading()"><mat-spinner diameter="30" /></div>

    <table mat-table [dataSource]="svc.items()" *ngIf="!svc.loading()">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="unidad">
        <th mat-header-cell *matHeaderCellDef>Unidad</th>
        <td mat-cell *matCellDef="let p">{{ p.unidad }}</td>
      </ng-container>
      <ng-container matColumnDef="stockActual">
        <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
        <td mat-cell *matCellDef="let p" [style.color]="p.stockActual <= p.stockMinimo ? 'red' : ''">
          {{ p.stockActual }}
        </td>
      </ng-container>
      <ng-container matColumnDef="stockMinimo">
        <th mat-header-cell *matHeaderCellDef>Stock Mínimo</th>
        <td mat-cell *matCellDef="let p">{{ p.stockMinimo }}</td>
      </ng-container>
      <ng-container matColumnDef="precioCompra">
        <th mat-header-cell *matHeaderCellDef>Precio Compra</th>
        <td mat-cell *matCellDef="let p">\${{ p.precioCompra }}</td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let p">
          <button mat-icon-button color="primary" [routerLink]="['/productos', p.id]">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['nombre','unidad','stockActual','stockMinimo','precioCompra','acciones']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['nombre','unidad','stockActual','stockMinimo','precioCompra','acciones']"></tr>
    </table>
  `
})
export class ProductoListComponent implements OnInit {
  svc = inject(ProductoService);

  ngOnInit(): void {
    this.svc.listar().subscribe();
  }
}
