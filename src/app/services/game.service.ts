import { Injectable } from '@angular/core';

interface Game {
  id: string;
  nome: string;
  descricao: string;
  urlInicio: string;
  rotas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private API = 'http://localhost:8080/api/jogos';

  // Lista os 4 jogos disponíveis
  async listarJogos(): Promise<{ total: number; jogos: Game[] }> {
    const response = await fetch(`${this.API}/listar`);

    if (!response.ok) {
      throw new Error('Erro ao listar jogos');
    }

    return response.json();
  }

  // Obtém detalhes de um jogo específico
  async obterDetalhesJogo(idJogo: string): Promise<Game> {
    const response = await fetch(`${this.API}/${idJogo}`);

    if (!response.ok) {
      throw new Error('Erro ao obter detalhes do jogo');
    }

    return response.json();
  }
}
