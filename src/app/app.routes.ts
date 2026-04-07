import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'


export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/index/index').then(m => m.IndexComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.CadastroComponent) },
  //{ path: 'aluno', loadComponent: () => import('./pages/aluno/aluno').then(m => m.AlunoComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  }
];
