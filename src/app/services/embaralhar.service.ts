import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmbaralharService {
  private API = `${environment.apiUrl}/embaralhar`;

  constructor(private http: HttpClient) {}

  listarJogosProfessor(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/professor/jogos`);
  }

  listarJogosAluno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/aluno/jogos`);
  }

  criarJogo(palavra: string, imagem: File, dificuldade: string): Observable<any> {
    const formData = new FormData();
    formData.append('palavra', palavra);
    formData.append('imagem', imagem);
    formData.append('dificuldade', dificuldade);
    return this.http.post(`${this.API}/professor/criar-jogo`, formData);
  }

  deletarJogo(id: number): Observable<any> {
  return this.http.post(`${this.API}/professor/deletar/${id}`, {});
}

  obterJogo(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/aluno/jogo-json/${id}`);
  }

  enviarResposta(gameId: number, resposta: string): Observable<any> {
    return this.http.post(`${this.API}/aluno/enviar-resposta-json`, { gameId, resposta });
  }
}
