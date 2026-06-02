import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OpcionMenu } from '../core/models/opcion-menu.model';

@Injectable({ providedIn: 'root' })
export class OpcionMenuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/opciones-menu`;

  obtenerMenu(rol: string): Observable<OpcionMenu[]> {
    return this.http.get<OpcionMenu[]>(`${this.apiUrl}?rol=${rol}`);
  }
}
