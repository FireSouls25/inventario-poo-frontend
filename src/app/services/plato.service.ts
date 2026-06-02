import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Plato, PlatoRequest } from '../core/models/plato.model';
import { MensajeResponse } from '../core/models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class PlatoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/platos`;

  readonly items = signal<Plato[]>([]);
  readonly loading = signal(false);

  listar(): Observable<Plato[]> {
    this.loading.set(true);
    return this.http.get<Plato[]>(this.apiUrl).pipe(
      tap(res => { this.items.set(res); this.loading.set(false); }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  listarDisponibles(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/disponibles`);
  }

  buscarPorId(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/${id}`);
  }

  crear(request: PlatoRequest): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, request: PlatoRequest): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  toggleDisponibilidad(id: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(`${this.apiUrl}/${id}/disponibilidad`, {}).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
