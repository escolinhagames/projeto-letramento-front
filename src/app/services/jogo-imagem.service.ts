import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JogoImagemService {

  private API = 'http://localhost:8080/jogo-imagem';

  async criarSala(
    palavraCorreta: string,
    dificuldade: string,
    img1: File, img2: File, img3: File,
    professorId: number,
    token: string
  ) {
    const form = new FormData();
    form.append('palavraCorreta', palavraCorreta);
    form.append('dificuldade', dificuldade);
    form.append('imagem1', img1);
    form.append('imagem2', img2);
    form.append('imagem3', img3);
    form.append('professorId', professorId.toString());

    const res = await fetch(`${this.API}/professor/criar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    if (!res.ok) throw new Error('Erro ao criar sala');
    return res.json();
  }

  async editarSala(
    id: number,
    palavraCorreta: string,
    dificuldade: string,
    img1: File | null,
    img2: File | null,
    img3: File | null,
    token: string
  ) {
    const form = new FormData();
    if (palavraCorreta) form.append('palavraCorreta', palavraCorreta);
    if (dificuldade)    form.append('dificuldade', dificuldade);
    if (img1) form.append('imagem1', img1);
    if (img2) form.append('imagem2', img2);
    if (img3) form.append('imagem3', img3);

    const res = await fetch(`${this.API}/professor/editar/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    if (!res.ok) throw new Error('Erro ao editar sala');
    return res.json();
  }

  async deletarSala(id: number, token: string) {
    const res = await fetch(`${this.API}/professor/deletar/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao deletar sala');
    return res.json();
  }

  async listarMinhasSalas(professorId: number, token: string) {
    const res = await fetch(`${this.API}/professor/minhas-salas/${professorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  async listarSalas() {
    const res = await fetch(`${this.API}/salas`);
    return res.json();
  }

  async buscarSala(id: number) {
    const res = await fetch(`${this.API}/salas/${id}`);
    return res.json();
  }
}
