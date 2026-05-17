import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface AuthResponse {
  nome: string;
  token: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = `${environment.apiUrl}/auth`;

  async login(email: string, senha: string): Promise<AuthResponse> {
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

  async register(nome: string, email: string, senha: string): Promise<AuthResponse> {
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

  salvarSessao(nome: string, token: string, id: number) {
    localStorage.setItem('nome', nome);
    localStorage.setItem('token', token);
    localStorage.setItem('professorId', id.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }
}
