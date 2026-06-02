import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MovimientoService } from '../../services/movimiento.service';
import { Producto } from '../../core/models/producto.model';
import { Movimiento } from '../../core/models/movimiento.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, NgFor, NgIf, DatePipe],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; margin-bottom:24px;">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar style="color:#e65100;">inventory_2</mat-icon>
          <mat-card-title>Productos</mat-card-title>
          <mat-card-subtitle>{{ totalProductos() }} registrados</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="loadingStock()"><mat-spinner diameter="30" /></div>
          <div *ngIf="!loadingStock()">
            <div *ngFor="let p of stockBajo()" style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f0ede8;">
              <span>{{ p.nombre }}</span>
              <span style="color:#c62828; font-weight:500;">{{ p.stockActual }} {{ p.unidad }}</span>
            </div>
            <div *ngIf="stockBajo().length === 0" style="display:flex; align-items:center; gap:8px; color:#2e7d32; padding:8px 0;">
              <mat-icon style="font-size:18px;width:18px;height:18px;">check_circle</mat-icon>
              <span>Todo en orden, sin stock bajo</span>
            </div>
            <div *ngIf="stockBajo().length > 0" style="margin-top:8px; font-size:13px; color:#a09890;">
              {{ stockBajo().length }} producto(s) por debajo del mínimo
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card>
      <mat-card-header>
        <mat-card-title>Movimientos Recientes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="loadingMov()" style="display:flex; justify-content:center; padding:24px;"><mat-spinner diameter="30" /></div>
        <table mat-table [dataSource]="movimientos().slice(0, 10)" *ngIf="!loadingMov()">
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let m">{{ m.fecha | date:'dd/MM HH:mm' }}</td>
          </ng-container>
          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let m">
              <span class="status-chip" [class]="'status-chip status-' + m.tipo">{{ m.tipo }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="producto">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let m">{{ m.productNombre }}</td>
          </ng-container>
          <ng-container matColumnDef="cantidad">
            <th mat-header-cell *matHeaderCellDef>Cantidad</th>
            <td mat-cell *matCellDef="let m">{{ m.cantidad }}</td>
          </ng-container>
          <ng-container matColumnDef="plato">
            <th mat-header-cell *matHeaderCellDef>Plato</th>
            <td mat-cell *matCellDef="let m">{{ m.platoNombre || '-' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['fecha','tipo','producto','cantidad','plato']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['fecha','tipo','producto','cantidad','plato'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `
})
export class DashboardComponent implements OnInit {
  private productoSvc = inject(ProductoService);
  private movSvc = inject(MovimientoService);

  readonly stockBajo = signal<Producto[]>([]);
  readonly totalProductos = signal(0);
  readonly movimientos = signal<Movimiento[]>([]);
  readonly loadingStock = signal(false);
  readonly loadingMov = signal(false);

  ngOnInit(): void {
    this.loadingStock.set(true);
    this.productoSvc.listarStockBajo().subscribe({
      next: res => { this.stockBajo.set(res); this.loadingStock.set(false); },
      error: () => this.loadingStock.set(false),
    });

    this.productoSvc.listar().subscribe({
      next: res => this.totalProductos.set(res.length),
    });

    this.loadingMov.set(true);
    this.movSvc.listar().subscribe({
      next: res => { this.movimientos.set(res); this.loadingMov.set(false); },
      error: () => this.loadingMov.set(false),
    });
  }
}
