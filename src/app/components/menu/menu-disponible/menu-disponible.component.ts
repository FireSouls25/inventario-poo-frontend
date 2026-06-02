import { Component, inject, OnInit, signal } from '@angular/core';
import { PlatoService } from '../../../services/plato.service';
import { Plato } from '../../../core/models/plato.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-disponible',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgFor, NgIf, RouterLink],
  template: `
    <h1>Menú Disponible</h1>

    <div *ngIf="loading()"><mat-spinner diameter="30" /></div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
      <mat-card *ngFor="let p of platos()">
        <mat-card-header>
          <mat-card-title>{{ p.nombre }}</mat-card-title>
          <mat-card-subtitle>\${{ p.precioVenta }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p *ngIf="p.descripcion">{{ p.descripcion }}</p>
          <p style="color:#666; font-size:0.9em;">
            {{ p.ingredientes.length || 0 }} ingrediente(s)
          </p>
          <p *ngIf="!p.conStock" style="color:#c62828; font-size:0.85em; font-weight:500;">
            <mat-icon style="font-size:16px;width:16px;height:16px;vertical-align:middle;">warning</mat-icon>
            Sin stock suficiente
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" [routerLink]="['/venta']" [queryParams]="{ platoId: p.id }">
            <mat-icon>shopping_cart</mat-icon> Vender
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <div *ngIf="!loading() && platos().length === 0" style="color:#666; margin-top:16px;">
      No hay platos disponibles en este momento.
    </div>
  `
})
export class MenuDisponibleComponent implements OnInit {
  private svc = inject(PlatoService);
  readonly platos = signal<Plato[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.svc.listarDisponibles().subscribe({
      next: res => { this.platos.set(res); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
