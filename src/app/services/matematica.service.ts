import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatematicaService {
  private API = `${environment.apiUrl}/matematica`;

  constructor(private http: HttpClient) {}

  criarSala(dificuldade: string, professorId: number, maxAcertos: number, maxErros: number): Observable<any> {
    const params = new HttpParams()
      .set('dificuldade', dificuldade)
      .set('professorId', professorId.toString())
      .set('maxAcertos', maxAcertos.toString())
      .set('maxErros', maxErros.toString());
    return this.http.post(`${this.API}/professor/criar`, null, { params });
  }

  listarMinhasSalas(professorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/professor/minhas-salas/${professorId}`);
  }

  desativarSala(id: number): Observable<any> {
    return this.http.post(`${this.API}/professor/desativar/${id}`, {});
  }

  listarSalas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/aluno/salas`);
  }

  gerarQuestao(salaId: number): Observable<any> {
    return this.http.get<any>(`${this.API}/aluno/questao/${salaId}`);
  }
}
