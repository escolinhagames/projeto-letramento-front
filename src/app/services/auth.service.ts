import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:8080/auth';

  async login(email: string, senha: string) {
    const response = await fetch(`${this.API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      throw new Error('Erro no login');
    }

    return response.json();
  }

  async register(nome: string, email: string, senha: string) {
    const response = await fetch(`${this.API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    if (!response.ok) {
      throw new Error('Erro no cadastro');
    }

    return response.json();
  }

  salvarSessao(nome: string, token: string) {
    localStorage.setItem('nome', nome);
    localStorage.setItem('token', token);
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
  }
}
