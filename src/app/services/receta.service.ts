import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IngredienteInfo, RecetaIngredienteRequest } from '../core/models/plato.model';
import { MensajeResponse } from '../core/models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/platos`;

  listarIngredientes(platoId: number): Observable<IngredienteInfo[]> {
    return this.http.get<IngredienteInfo[]>(`${this.baseUrl}/${platoId}/receta`);
  }

  agregarIngrediente(platoId: number, request: RecetaIngredienteRequest): Observable<IngredienteInfo> {
    return this.http.post<IngredienteInfo>(`${this.baseUrl}/${platoId}/receta`, request);
  }

  actualizarIngrediente(platoId: number, itemId: number, request: RecetaIngredienteRequest): Observable<IngredienteInfo> {
    return this.http.put<IngredienteInfo>(`${this.baseUrl}/${platoId}/receta/${itemId}`, request);
  }

  eliminarIngrediente(platoId: number, itemId: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.baseUrl}/${platoId}/receta/${itemId}`);
  }
}
