import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  // Alunos não precisam de autenticação
  if (tipoUsuario === 'aluno') {
    return true;
  }

  // Professores precisam estar logados
  if (!token) {
    alert('Você precisa estar logado como professor');
    window.location.href = '/';
    return false;
  }

  return true;
};
