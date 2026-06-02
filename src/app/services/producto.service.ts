import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ProductoRequest } from '../core/models/producto.model';
import { MensajeResponse } from '../core/models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`;

  readonly items = signal<Producto[]>([]);
  readonly loading = signal(false);

  listar(): Observable<Producto[]> {
    this.loading.set(true);
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      tap(res => { this.items.set(res); this.loading.set(false); }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  buscarPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  listarStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/stock-bajo`);
  }

  crear(request: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, request: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  desactivar(id: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(`${this.apiUrl}/${id}/desactivar`, {}).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
