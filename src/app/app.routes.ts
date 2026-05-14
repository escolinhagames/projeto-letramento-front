import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 🏠 PÚBLICO (bloqueado se professor logado)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/index/index').then(m => m.IndexComponent)
  },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then(m => m.CadastroComponent)
  },
  {
    path: 'creditos', // 🔥 única rota nova adicionada
    loadComponent: () =>
      import('./pages/creditos/creditos').then(m => m.CreditosComponent)
  },

  // 🔒 PROFESSOR
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'professor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/professor/professor').then(m => m.ProfessorComponent)
  },
  {
    path: 'professor/detalhes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./detalhes-jogo/detalhes-jogo').then(m => m.DetalhesJogoComponent)
  },

  // 👨‍🎓 ALUNO (bloqueado para professor)
  {
    path: 'aluno',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/aluno/aluno').then(m => m.AlunoComponent)
  },
  {
    path: 'aluno-dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/aluno-dashboard/aluno-dashboard').then(m => m.AlunoDashboardComponent)
  },
  {
    path: 'aluno/jogo/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./jogo/jogo').then(m => m.JogoComponent)
  },

  // 🎮 OUTROS
  {
    path: 'memorizacao',
    loadComponent: () =>
      import('./memorizacao/memorizacao').then(m => m.MemorizacaoComponent)
  },
  {
    path: 'bingo/jogo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/bingo-jogo/bingo-jogo').then(m => m.BingoJogoComponent)
  },
  {
  path: 'professor-imagem',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/professor-imagem/professor-imagem')
      .then(m => m.ProfessorImagemComponent)
  },
  {
    path: 'aluno-imagem',
    loadComponent: () =>
      import('./pages/aluno-imagem/aluno-imagem')
        .then(m => m.AlunoImagemComponent)
  },
  {
    path: 'jogo-imagem/:id',
    loadComponent: () =>
      import('./pages/jogo-imagem/jogo-imagem')
        .then(m => m.JogoImagemComponent)
  },
];
