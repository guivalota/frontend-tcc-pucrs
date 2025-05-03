import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload['roles'] || payload['role'] || [];
    console.debug(roles)
    if (Array.isArray(roles) && roles.includes('Admin')) {
      return true;
    } else {
      router.navigate(['/access-denied']);
      return false;
    }
  } catch (e) {
    console.error('Erro ao decodificar token', e);
  }

  router.navigate(['/login']);
  return false;
};
