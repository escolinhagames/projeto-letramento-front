import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  const rota = route.routeConfig?.path || '';

  // 🔒 Rotas de aluno — bloqueado para professor
  if (rota === 'aluno' || rota === 'aluno-dashboard' || rota.startsWith('aluno/')) {
    if (tipoUsuario === 'professor') {
      alert('Área exclusiva para alunos');
      return router.parseUrl('/dashboard'); // 🔥 troca navigate por parseUrl
    }
  }

  // 🔒 Index/login/cadastro — se professor logado, vai pro dashboard
  if (rota === '' || rota === 'login' || rota === 'cadastro') {
    if (token && tipoUsuario === 'professor') {
      return router.parseUrl('/dashboard'); // 🔥 troca navigate por parseUrl
    }
  }

  // 🔒 Rotas exclusivas de professor
  if (rota === 'dashboard' || rota === 'professor' || rota.startsWith('professor/')) {
    if (!token || tipoUsuario !== 'professor') {
      alert('Acesso permitido apenas para professores logados');
      return router.parseUrl('/login'); // 🔥 troca navigate por parseUrl
    }
  }

  // 🔒 Bingo
  if (rota.startsWith('bingo')) {
    if (!token && tipoUsuario !== 'aluno') {
      alert('Você precisa estar logado');
      return router.parseUrl('/'); // 🔥 troca navigate por parseUrl
    }
  }

  return true;
};
