import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatoService } from '../../../services/plato.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-plato-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, NgIf],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h1>Platos</h1>
      <button mat-raised-button color="primary" routerLink="/platos/nuevo">
        <mat-icon>add</mat-icon> Nuevo Plato
      </button>
    </div>

    <div *ngIf="svc.loading()"><mat-spinner diameter="30" /></div>

    <table mat-table [dataSource]="svc.items()" *ngIf="!svc.loading()">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="precioVenta">
        <th mat-header-cell *matHeaderCellDef>Precio Venta</th>
        <td mat-cell *matCellDef="let p">\${{ p.precioVenta }}</td>
      </ng-container>
      <ng-container matColumnDef="disponible">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let p">
          <mat-chip [color]="p.disponible ? 'primary' : 'warn'" highlighted>
            {{ p.disponible ? 'Disponible' : 'No disponible' }}
          </mat-chip>
        </td>
      </ng-container>
      <ng-container matColumnDef="ingredientes">
        <th mat-header-cell *matHeaderCellDef>Ingredientes</th>
        <td mat-cell *matCellDef="let p">{{ p.ingredientes?.length || 0 }} producto(s)</td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let p">
          <button mat-icon-button color="primary" [routerLink]="['/platos', p.id]">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['nombre','precioVenta','disponible','ingredientes','acciones']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['nombre','precioVenta','disponible','ingredientes','acciones']"></tr>
    </table>
  `
})
export class PlatoListComponent implements OnInit {
  svc = inject(PlatoService);

  ngOnInit(): void {
    this.svc.listar().subscribe();
  }
}
