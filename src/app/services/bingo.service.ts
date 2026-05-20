import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface SalaJogo {
  codigo: string;
  professor: string;
  numerosSorteados: number[];
  ultimoNumero: number;
  alunos: string[];
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class BingoService {

  private API = `${environment.apiUrl}/api/bingo/sala`;

  constructor(private http: HttpClient) {}

  // Professor cria uma nova sala
  criarSala(professor: string): Observable<{ codigo: string; professor: string; status: string }> {
    return this.http.post<{ codigo: string; professor: string; status: string }>(
      `${this.API}/criar?professor=${encodeURIComponent(professor)}`,
      {}
    );
  }

  // Obtém informações de uma sala
  obterSala(codigo: string): Observable<SalaJogo> {
    return this.http.get<SalaJogo>(`${this.API}/${codigo}`);
  }

  // Professor sorteia um número
  sortearNumero(codigo: string): Observable<{ numero: number; numerosSorteados: number[]; mensagem: string }> {
    return this.http.post<{ numero: number; numerosSorteados: number[]; mensagem: string }>(
      `${this.API}/${codigo}/sortear`,
      {}
    );
  }

  // Aluno entra na sala
  entrarSala(codigo: string, nome: string): Observable<{ mensagem: string; cartela: number[]; codigo: string; nome: string }> {
    return this.http.post<{ mensagem: string; cartela: number[]; codigo: string; nome: string }>(
      `${this.API}/${codigo}/aluno/entrar?nome=${encodeURIComponent(nome)}`,
      {}
    );
  }

  // Aluno marca um número
  marcarNumero(codigo: string, nome: string, numero: number): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(
      `${this.API}/${codigo}/aluno/${encodeURIComponent(nome)}/marcar?numero=${numero}`,
      {}
    );
  }

  // Aluno desmarca um número
  desmarcarNumero(codigo: string, nome: string, numero: number): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(
      `${this.API}/${codigo}/aluno/${encodeURIComponent(nome)}/desmarcar?numero=${numero}`,
      {}
    );
  }

  // Verifica se aluno completou o bingo
  verificarBingo(codigo: string, nome: string): Observable<{ bingo: boolean; mensagem: string }> {
    return this.http.get<{ bingo: boolean; mensagem: string }>(
      `${this.API}/${codigo}/aluno/${encodeURIComponent(nome)}/bingo`
    );
  }

  // Reseta a sala para um novo jogo
  resetarSala(codigo: string): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.API}/${codigo}/reset`, {});
  }

  // Encerra a sala
  encerrarSala(codigo: string): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.API}/${codigo}/encerrar`, {});
  }

  listarSalasAtivas(): Observable<{ codigo: string; professor: string }[]> {
    return this.http.get<{ codigo: string; professor: string }[]>(
        `${this.API}/ativas`
    );
  }
}
