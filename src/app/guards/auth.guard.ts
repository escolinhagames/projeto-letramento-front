import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  const rota = route.routeConfig?.path || '';

  //  Index/login/cadastro — se professor logado, vai pro dashboard
  if (rota === '' || rota === 'login' || rota === 'cadastro') {
    if (token && tipoUsuario === 'professor') {
      return router.parseUrl('/dashboard'); // 🔥 troca navigate por parseUrl
    }
  }

  const rotasProfessor = [
    'dashboard', 'professor', 'bingo/professor',
    'embaralhar/professor', 'professor-imagem'
  ];

  if (rotasProfessor.some(r => rota.startsWith(r))) {
    if (!token || tipoUsuario !== 'professor') {
      alert('Acesso permitido apenas para professores logados');
      return router.parseUrl('/login');
    }
  }

  //  Bingo
  if (rota.startsWith('bingo')) {
    if (!token && tipoUsuario !== 'aluno') {
      alert('Você precisa estar logado');
      return router.parseUrl('/'); // 🔥 troca navigate por parseUrl
    }
  }

  return true;
};
