import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'


export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/index/index').then(m => m.IndexComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.CadastroComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'aluno-dashboard',
    loadComponent: () =>
      import('./pages/aluno-dashboard/aluno-dashboard').then(m => m.AlunoDashboardComponent)
  },
  {
    path: 'professor',
    loadComponent: () => import('./professor/professor').then(m => m.ProfessorComponent)
  },
  {
    path: 'aluno',
    loadComponent: () => import('./aluno/aluno').then(m => m.AlunoComponent)
  },
  {
    path: 'aluno/jogo/:id',
    loadComponent: () => import('./jogo/jogo').then(m => m.JogoComponent)
  },
  {
    path: 'professor/detalhes/:id',
    loadComponent: () => import('./detalhes-jogo/detalhes-jogo').then(m => m.DetalhesJogoComponent)
  },
  {
    path: 'memorizacao',
    loadComponent: () => import('./memorizacao/memorizacao').then(m => m.MemorizacaoComponent)
  },
  {
    path: 'bingo/jogo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/bingo-jogo/bingo-jogo').then(m => m.BingoJogoComponent)
  }
];
