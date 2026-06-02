import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioRequest } from '../core/models/usuario.model';
import { MensajeResponse } from '../core/models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  readonly items = signal<Usuario[]>([]);
  readonly loading = signal(false);

  listar(soloActivos: boolean = false): Observable<Usuario[]> {
    this.loading.set(true);
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      tap(res => {
        this.items.set(soloActivos ? res.filter(u => u.activo) : res);
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(request: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, request: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  desactivar(id: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}
