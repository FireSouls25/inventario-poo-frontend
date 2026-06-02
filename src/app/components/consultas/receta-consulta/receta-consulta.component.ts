import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlatoService } from '../../../services/plato.service';
import { Plato } from '../../../core/models/plato.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-receta-consulta',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgIf],
  template: `
    <div *ngIf="loading()"><mat-spinner diameter="30" /></div>

    <div *ngIf="plato() as p">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <button mat-icon-button routerLink="/platos">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ p.nombre }}</h1>
      </div>

      <mat-card style="margin-bottom:16px;">
        <mat-card-content>
          <p><strong>Precio:</strong> \${{ p.precioVenta }}</p>
          <p *ngIf="p.descripcion"><strong>Descripción:</strong> {{ p.descripcion }}</p>
          <p>
            <strong>Estado:</strong>
            <span [style.color]="p.disponible ? 'green' : 'red'">
              {{ p.disponible ? 'Disponible' : 'No disponible' }}
            </span>
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Ingredientes</mat-card-title>
          <mat-card-subtitle>{{ p.ingredientes.length || 0 }} producto(s)</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="p.ingredientes">
            <ng-container matColumnDef="productoNombre">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let i">{{ i.productoNombre }}</td>
            </ng-container>
            <ng-container matColumnDef="cantidad">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let i">{{ i.cantidad }}</td>
            </ng-container>
            <ng-container matColumnDef="unidad">
              <th mat-header-cell *matHeaderCellDef>Unidad</th>
              <td mat-cell *matCellDef="let i">{{ i.unidad }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['productoNombre','cantidad','unidad']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['productoNombre','cantidad','unidad']"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class RecetaConsultaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(PlatoService);
  readonly plato = signal<Plato | null>(null);
  readonly loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loading.set(true);
      this.svc.buscarPorId(+id).subscribe({
        next: res => { this.plato.set(res); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }
}
