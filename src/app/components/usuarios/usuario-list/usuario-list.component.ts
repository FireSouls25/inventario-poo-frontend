import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatTooltipModule, NgIf],
  template: `
    <div class="page-header">
      <h1>Usuarios</h1>
      <button mat-raised-button color="primary" routerLink="/usuarios/nuevo">
        <mat-icon>add</mat-icon> Nuevo Usuario
      </button>
    </div>

    <div *ngIf="svc.loading()" style="display:flex; justify-content:center; padding:24px;"><mat-spinner diameter="30" /></div>

    <table mat-table [dataSource]="svc.items()" *ngIf="!svc.loading()">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let u">{{ u.nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let u">{{ u.email }}</td>
      </ng-container>
      <ng-container matColumnDef="rol">
        <th mat-header-cell *matHeaderCellDef>Rol</th>
        <td mat-cell *matCellDef="let u">
          <span class="role-badge" [class]="'role-badge role-' + u.rol">{{ u.rol }}</span>
        </td>
      </ng-container>
      <ng-container matColumnDef="activo">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let u">
          <mat-chip [color]="u.activo ? 'primary' : 'warn'" highlighted>
            {{ u.activo ? 'Activo' : 'Inactivo' }}
          </mat-chip>
        </td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let u">
          <button mat-icon-button color="primary" [routerLink]="['/usuarios', u.id]" matTooltip="Editar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="desactivar(u)" *ngIf="u.activo" matTooltip="Desactivar">
            <mat-icon>block</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['nombre','email','rol','activo','acciones']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['nombre','email','rol','activo','acciones']"></tr>
    </table>
  `
})
export class UsuarioListComponent implements OnInit {
  svc = inject(UsuarioService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.svc.listar().subscribe();
  }

  desactivar(u: any): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Desactivar usuario',
        mensaje: `¿Desactivar a ${u.nombre} (${u.email})?`,
      },
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.svc.desactivar(u.id).subscribe();
      }
    });
  }
}
