import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 🏠 PÚBLICO
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
    path: 'creditos',
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

  {
  path: 'embaralhar/professor/detalhes/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/embaralhar-professor/embaralhar-professor')
      .then(m => m.EmbaralharProfessorComponent)
  },

  {
    path: 'matematica/professor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/matematica-professor/matematica-professor')
        .then(m => m.MatematicaProfessorComponent)
  },

  // 👨‍🎓 ALUNO
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

  {
    path: 'jogo-estados/jogo/aluno',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/aluno-mapa/jogo-aluno.component').then(m => m.JogoAlunoComponent)
  },
  {
    path: 'jogo-estados/jogo/professor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/professor-mapa/jogo-professor.component').then(m => m.JogoProfessorComponent)
  },

  {
    path: 'matematica/aluno',
    loadComponent: () =>
      import('./pages/matematica-aluno/matematica-aluno')
        .then(m => m.MatematicaAlunoComponent)
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

  // ✅ NOVO: Bingo Angular
  {
    path: 'bingo/professor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/bingo-professor/bingo-professor').then(m => m.BingoProfessorComponent)
  },
  {
    path: 'bingo/aluno',
    loadComponent: () =>
      import('./pages/bingo-aluno/bingo-aluno').then(m => m.BingoAlunoComponent)
  },

  // ✅ NOVO: Embaralhar Angular
  {
    path: 'embaralhar/professor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/embaralhar-professor/embaralhar-professor').then(m => m.EmbaralharProfessorComponent)
  },
  {
    path: 'embaralhar/aluno',
    loadComponent: () =>
      import('./pages/embaralhar-aluno/embaralhar-aluno').then(m => m.EmbaralharAlunoComponent)
  },
  {
    path: 'embaralhar/aluno/jogo/:id',
    loadComponent: () =>
      import('./pages/embaralhar-jogo/embaralhar-jogo').then(m => m.EmbaralharJogoComponent)
  },

  {
    path: 'matematica/aluno/jogo/:id',
    loadComponent: () =>
      import('./pages/matematica-jogo/matematica-jogo')
        .then(m => m.MatematicaJogoComponent)
  },
  {
    path: 'jogo-estados',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/professor-mapa/jogo-professor.component')
        .then(m => m.JogoProfessorComponent)
  },
];
