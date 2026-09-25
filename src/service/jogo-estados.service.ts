import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, interval, startWith, switchMap, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Estado } from '../models/estado.model';

/**
 * Centraliza a comunicação com o backend do jogo dos estados.
 *
 * O backend é a fonte da verdade sobre qual é o estado da rodada atual.
 * O aluno e o professor consultam o mesmo endpoint (via polling simples)
 * para permanecerem sincronizados; quando o professor troca o estado,
 * a tela do aluno reflete a mudança na próxima consulta.
 *
 * O estado só deve mudar quando o professor clica em "Mudar estado".
 */
@Injectable({ providedIn: 'root' })
export class JogoEstadosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/jogo`;
  private readonly intervaloPollingMs = 2000;

  private sincronizacaoIniciada = false;

  /** Estado sorteado atualmente (null enquanto a primeira busca não retorna). */
  readonly estadoAtual = signal<Estado | null>(null);

  /**
   * Inicia o polling periódico do estado atual. Pode ser chamado com segurança
   * a partir de vários componentes (aluno e professor): só o primeiro efetivamente
   * inicia o intervalo, os demais reaproveitam o mesmo estado compartilhado.
   */
  iniciarSincronizacao(): void {
    if (this.sincronizacaoIniciada) {
      return;
    }
    this.sincronizacaoIniciada = true;

    interval(this.intervaloPollingMs)
      .pipe(
        startWith(0),
        switchMap(() => this.buscarEstadoAtual())
      )
      .subscribe({
        next: (estado) => this.atualizarSeMudou(estado),
        error: (erro) => console.error('Falha ao sincronizar estado do jogo:', erro)
      });
  }

  buscarEstadoAtual(): Observable<Estado> {
    return this.http.get<Estado>(`${this.baseUrl}/estado-atual`);
  }

  /** Chamado pelo professor para sortear um novo estado. */
  mudarEstado(): Observable<Estado> {
    return this.http.post<Estado>(`${this.baseUrl}/mudar-estado`, {}).pipe(
      tap((estado) => this.estadoAtual.set(estado))
    );
  }

  /**
   * Só atualiza o signal quando a sigla realmente muda.
   * Evita disparar efeitos (como limpar o feedback de acerto/erro na tela
   * do aluno) a cada ciclo de polling quando nada mudou.
   */
  private atualizarSeMudou(estado: Estado): void {
    const atual = this.estadoAtual();
    if (!atual || atual.sigla !== estado.sigla) {
      this.estadoAtual.set(estado);
    }
  }
}
