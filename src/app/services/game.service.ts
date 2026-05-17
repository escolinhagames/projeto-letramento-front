import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

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

  private API = `${environment.apiUrl}/api/jogos`;

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
