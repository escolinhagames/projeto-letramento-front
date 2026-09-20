import { Routes } from '@angular/router';

export const JOGO_ESTADOS_ROUTES: Routes = [
  {
    path: 'jogo/aluno',
    loadComponent: () =>
      import('./aluno/jogo-aluno.component').then((m) => m.JogoAlunoComponent)
  },
  {
    path: 'jogo/professor',
    loadComponent: () =>
      import('./professor/jogo-professor.component').then((m) => m.JogoProfessorComponent)
  }
];
