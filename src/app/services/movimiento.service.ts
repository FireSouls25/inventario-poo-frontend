import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movimiento, EntradaRequest, SalidaRequest, AjusteRequest } from '../core/models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/movimientos`;

  readonly items = signal<Movimiento[]>([]);
  readonly loading = signal(false);

  listar(productoId?: number, tipo?: string, fechaDesde?: string, fechaHasta?: string): Observable<Movimiento[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (productoId) params = params.set('productoId', productoId);
    if (tipo) params = params.set('tipo', tipo);
    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);

    return this.http.get<Movimiento[]>(this.apiUrl, { params }).pipe(
      tap(res => { this.items.set(res); this.loading.set(false); }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  registrarEntrada(request: EntradaRequest): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.apiUrl}/entrada`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  registrarSalida(request: SalidaRequest): Observable<Movimiento[]> {
    return this.http.post<Movimiento[]>(`${this.apiUrl}/salida`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  registrarAjuste(request: AjusteRequest): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.apiUrl}/ajuste`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
