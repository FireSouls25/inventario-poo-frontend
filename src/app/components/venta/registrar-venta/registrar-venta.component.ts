import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { PlatoService } from '../../../services/plato.service';
import { Plato } from '../../../core/models/plato.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, NgIf],
  template: `
    <div style="max-width:600px; margin:0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Registrar Venta</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="loadingPlato()"><mat-spinner diameter="30" /></div>

          <div *ngIf="plato() as p">
            <h2>{{ p.nombre }}</h2>
            <p><strong>Precio:</strong> \${{ p.precioVenta }}</p>

            <h3>Ingredientes a descontar:</h3>
            <table mat-table [dataSource]="p.ingredientes" style="margin-bottom:16px;">
              <ng-container matColumnDef="productoNombre">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let i">{{ i.productoNombre }}</td>
              </ng-container>
              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let i">{{ i.cantidad }} {{ i.unidad }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['productoNombre','cantidad']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['productoNombre','cantidad']"></tr>
            </table>

            <div *ngIf="error()" style="color:red; margin-bottom:8px;">{{ error() }}</div>
            <div *ngIf="success()" style="color:green; margin-bottom:8px;">{{ success() }}</div>

            <button mat-raised-button color="primary" (click)="confirmarVenta()" [disabled]="loading()">
              <mat-icon>check</mat-icon> Confirmar Venta
            </button>
            <button mat-button routerLink="/movimientos" style="margin-left:8px;">Cancelar</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class RegistrarVentaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movSvc = inject(MovimientoService);
  private platoSvc = inject(PlatoService);

  readonly plato = signal<Plato | null>(null);
  readonly loadingPlato = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    const platoId = this.route.snapshot.queryParams['platoId'] || this.route.snapshot.params['platoId'];
    if (platoId) {
      this.loadingPlato.set(true);
      this.platoSvc.buscarPorId(+platoId).subscribe({
        next: res => { this.plato.set(res); this.loadingPlato.set(false); },
        error: () => this.loadingPlato.set(false),
      });
    }
  }

  confirmarVenta(): void {
    const platoId = this.plato()?.id;
    if (!platoId) return;

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.movSvc.registrarSalida({ platoId }).subscribe({
      next: () => {
        this.success.set('Venta registrada correctamente. Stock actualizado.');
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.mensaje || 'Error al registrar venta');
      },
    });
  }
}
