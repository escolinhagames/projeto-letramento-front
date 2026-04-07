import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Você precisa estar logado');
    window.location.href = '/';
    return false;
  }

  return true;
};
