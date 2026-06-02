import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./shared/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'productos', loadComponent: () => import('./components/productos/producto-list/producto-list.component').then(m => m.ProductoListComponent) },
      { path: 'productos/nuevo', loadComponent: () => import('./components/productos/producto-form/producto-form.component').then(m => m.ProductoFormComponent) },
      { path: 'productos/:id', loadComponent: () => import('./components/productos/producto-form/producto-form.component').then(m => m.ProductoFormComponent) },
      { path: 'platos', loadComponent: () => import('./components/platos/plato-list/plato-list.component').then(m => m.PlatoListComponent) },
      { path: 'platos/nuevo', loadComponent: () => import('./components/platos/plato-form/plato-form.component').then(m => m.PlatoFormComponent) },
      { path: 'platos/:id', loadComponent: () => import('./components/platos/plato-form/plato-form.component').then(m => m.PlatoFormComponent) },
      { path: 'usuarios', loadComponent: () => import('./components/usuarios/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'usuarios/nuevo', loadComponent: () => import('./components/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'usuarios/:id', loadComponent: () => import('./components/usuarios/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'movimientos', loadComponent: () => import('./components/movimientos/movimiento-list/movimiento-list.component').then(m => m.MovimientoListComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'movimientos/entrada', loadComponent: () => import('./components/movimientos/entrada-form/entrada-form.component').then(m => m.EntradaFormComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'movimientos/ajuste', loadComponent: () => import('./components/movimientos/ajuste-form/ajuste-form.component').then(m => m.AjusteFormComponent), canActivate: [rolGuard], data: { roles: ['ADMIN'] } },
      { path: 'menu', loadComponent: () => import('./components/menu/menu-disponible/menu-disponible.component').then(m => m.MenuDisponibleComponent), canActivate: [rolGuard], data: { roles: ['MESERO'] } },
      { path: 'venta', loadComponent: () => import('./components/venta/registrar-venta/registrar-venta.component').then(m => m.RegistrarVentaComponent), canActivate: [rolGuard], data: { roles: ['ADMIN', 'MESERO'] } },
      { path: 'stock', loadComponent: () => import('./components/consultas/stock-consulta/stock-consulta.component').then(m => m.StockConsultaComponent), canActivate: [rolGuard], data: { roles: ['CHEF'] } },
      { path: 'recetas/:id', loadComponent: () => import('./components/consultas/receta-consulta/receta-consulta.component').then(m => m.RecetaConsultaComponent), canActivate: [rolGuard], data: { roles: ['CHEF'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
