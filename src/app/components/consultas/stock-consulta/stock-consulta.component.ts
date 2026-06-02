import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-consulta',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, NgIf, FormsModule],
  template: `
    <h1>Consulta de Stock</h1>

    <mat-form-field appearance="outline" style="width:100%; max-width:400px; margin-bottom:16px;">
      <mat-label>Buscar producto</mat-label>
      <input matInput [(ngModel)]="filtro" placeholder="Escribe para filtrar...">
    </mat-form-field>

    <div *ngIf="svc.loading()"><mat-spinner diameter="30" /></div>

    <table mat-table [dataSource]="productosFiltrados()" *ngIf="!svc.loading()">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Producto</th>
        <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="unidad">
        <th mat-header-cell *matHeaderCellDef>Unidad</th>
        <td mat-cell *matCellDef="let p">{{ p.unidad }}</td>
      </ng-container>
      <ng-container matColumnDef="stockActual">
        <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
        <td mat-cell *matCellDef="let p" [style.color]="p.stockActual <= p.stockMinimo ? 'red' : ''" style="font-weight:500;">
          {{ p.stockActual }}
        </td>
      </ng-container>
      <ng-container matColumnDef="stockMinimo">
        <th mat-header-cell *matHeaderCellDef>Stock Mínimo</th>
        <td mat-cell *matCellDef="let p">{{ p.stockMinimo }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['nombre','unidad','stockActual','stockMinimo']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['nombre','unidad','stockActual','stockMinimo']"
          [style.background]="row.stockActual <= row.stockMinimo ? '#fff3e0' : ''">
      </tr>
    </table>
  `
})
export class StockConsultaComponent implements OnInit {
  svc = inject(ProductoService);
  filtro = '';

  ngOnInit(): void {
    this.svc.listar().subscribe();
  }

  get productosFiltrados() {
    return () => {
      const items = this.svc.items();
      if (!this.filtro) return items;
      return items.filter(p =>
        p.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      );
    };
  }
}
