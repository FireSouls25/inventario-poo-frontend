import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgIf, DatePipe],
  template: `
    <div class="page-header">
      <h1>Movimientos de Stock</h1>
      <div style="display:flex; gap:8px;">
        <button mat-raised-button color="primary" routerLink="/movimientos/entrada">
          <mat-icon>add</mat-icon> Entrada
        </button>
        <button mat-raised-button color="accent" routerLink="/movimientos/ajuste">
          <mat-icon>tune</mat-icon> Ajuste
        </button>
      </div>
    </div>

    <div *ngIf="svc.loading()" style="display:flex; justify-content:center; padding:24px;"><mat-spinner diameter="30" /></div>

    <table mat-table [dataSource]="svc.items()" *ngIf="!svc.loading()">
      <ng-container matColumnDef="fecha">
        <th mat-header-cell *matHeaderCellDef>Fecha</th>
        <td mat-cell *matCellDef="let m">{{ m.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
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
      <ng-container matColumnDef="proveedorMotivo">
        <th mat-header-cell *matHeaderCellDef>Detalle</th>
        <td mat-cell *matCellDef="let m">{{ m.proveedor || m.motivo || '-' }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['fecha','tipo','producto','cantidad','proveedorMotivo']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['fecha','tipo','producto','cantidad','proveedorMotivo']"></tr>
    </table>
  `
})
export class MovimientoListComponent implements OnInit {
  svc = inject(MovimientoService);

  ngOnInit(): void {
    this.svc.listar().subscribe();
  }
}
