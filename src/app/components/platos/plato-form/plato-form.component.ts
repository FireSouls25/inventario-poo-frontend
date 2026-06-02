import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlatoService } from '../../../services/plato.service';
import { RecetaService } from '../../../services/receta.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecetaIngredientesComponent } from '../receta-ingredientes/receta-ingredientes.component';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-plato-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, RecetaIngredientesComponent, NgIf],
  template: `
    <div style="max-width:800px; margin:0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ esEdicion ? 'Editar' : 'Nuevo' }} Plato</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Precio de Venta</mat-label>
              <input matInput type="number" step="0.01" formControlName="precioVenta">
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px;">
              <mat-label>Descripción</mat-label>
              <textarea matInput rows="3" formControlName="descripcion"></textarea>
            </mat-form-field>

            <div *ngIf="error" style="color:red; margin-bottom:8px;">{{ error }}</div>

            <div style="display:flex; gap:8px; justify-content:flex-end; margin-bottom:16px;">
              <button mat-button routerLink="/platos">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- RECURSIVIDAD: Ingredientes anidados -->
      <mat-card *ngIf="esEdicion" style="margin-top:16px;">
        <mat-card-header>
          <mat-card-title>Ingredientes de la Receta</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-receta-ingredientes [platoId]="platoId" />
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class PlatoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(PlatoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nombre: ['', Validators.required],
    precioVenta: [0, [Validators.required, Validators.min(0.01)]],
    descripcion: [''],
  });

  esEdicion = false;
  loading = false;
  error = '';
  platoId = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.esEdicion = true;
      this.platoId = +id;
      this.svc.buscarPorId(+id).subscribe(p => {
        this.form.patchValue({
          nombre: p.nombre,
          precioVenta: p.precioVenta,
          descripcion: p.descripcion,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const id = this.route.snapshot.params['id'];
    const obs = id
      ? this.svc.actualizar(+id, this.form.value as any)
      : this.svc.crear(this.form.value as any);

    obs.subscribe({
      next: (res) => {
        if (!id) {
          this.router.navigate(['/platos', res.id]);
        } else {
          this.router.navigate(['/platos']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.mensaje || 'Error al guardar';
      },
    });
  }
}
