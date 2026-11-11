import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ESTADOS_BRASIL } from '../app/pages/mapa-brasil/estados-brasil.data';
import { Estado } from '../models/estado.model';

/**
 * Mantém duas fontes de estado:
 * - global: compartilhada pelos alunos e pelo professor via localStorage
 * - local: individual por aba/sessionStorage para o avanço do aluno ao acertar
 *
 * Isso permite que o professor force a mesma rodada para todos os alunos,
 * sem quebrar a regra de que o aluno avança sozinho ao acertar.
 */
@Injectable({ providedIn: 'root' })
export class JogoEstadosService {
  private readonly chaveEstadoGlobal = 'jogo-mapa-estado-atual-global';
  private readonly chaveEstadoLocal = 'jogo-mapa-estado-atual-local';
  private readonly chaveDificuldade = 'jogo-mapa-dificuldade';
  private readonly canalSincronizacao = 'jogo-mapa-sync';
  private readonly apiBaseUrl = 'http://localhost:8080/api/jogo';
  private sincronizacaoIniciada = false;
  private canalBroadcast: BroadcastChannel | null = null;
  private timerSincronizacao: number | null = null;
  private isSincronizandoDificuldade = false;
  private ultimaAtualizacaoGlobal = 0;
  private ultimaAtualizacaoLocal = 0;

  /** Estado atual compartilhado pelos alunos e professor. */
  readonly estadoAtual = signal<Estado | null>(null);
  readonly dificuldadeAtual = signal<'facil' | 'dificil'>('facil');

  setDificuldade(dificuldade: 'facil' | 'dificil'): void {
    if (this.dificuldadeAtual() === dificuldade) {
      return;
    }

    this.dificuldadeAtual.set(dificuldade);
    this.persistirDificuldadeLocal(dificuldade);
    this.notificarDificuldade(dificuldade);

    if (typeof fetch === 'function') {
      fetch(`${this.apiBaseUrl}/dificuldade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ dificuldade })
      }).catch(() => undefined);
    }
  }

  private carregarDificuldadeInicial(): 'facil' | 'dificil' {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'facil';
    }

    const valor = window.localStorage.getItem(this.chaveDificuldade);
    return valor === 'dificil' ? 'dificil' : 'facil';
  }

  private aplicarDificuldade(dificuldade: 'facil' | 'dificil'): void {
    if (this.dificuldadeAtual() === dificuldade) {
      return;
    }

    this.dificuldadeAtual.set(dificuldade);
  }

  private persistirDificuldadeLocal(dificuldade: 'facil' | 'dificil'): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.chaveDificuldade, dificuldade);
    }
  }

  private notificarDificuldade(dificuldade: 'facil' | 'dificil'): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jogo-mapa-dificuldade-sync', {
        detail: { dificuldade }
      }));
    }

    if (this.canalBroadcast) {
      this.canalBroadcast.postMessage({ tipo: 'dificuldade', dificuldade });
    }
  }

  iniciarSincronizacao(): void {
    if (this.sincronizacaoIniciada) {
      return;
    }

    this.sincronizacaoIniciada = true;

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.chaveDificuldade) {
          const dificuldade = (event.newValue === 'dificil' ? 'dificil' : 'facil') as 'facil' | 'dificil';
          this.aplicarDificuldade(dificuldade);
          return;
        }

        if (event.key !== this.chaveEstadoGlobal) {
          return;
        }

        this.aplicarEstadoGlobal(event.newValue ? JSON.parse(event.newValue) as Estado : null);
      });

      window.addEventListener('jogo-mapa-sync', ((event: Event) => {
        const customEvent = event as CustomEvent<{ estado: Estado | null } | undefined>;
        const estado = customEvent.detail?.estado ?? null;
        this.aplicarEstadoGlobal(estado);
      }) as EventListener);

      window.addEventListener('jogo-mapa-dificuldade-sync', ((event: Event) => {
        const customEvent = event as CustomEvent<{ dificuldade?: 'facil' | 'dificil' } | undefined>;
        const dificuldade = customEvent.detail?.dificuldade ?? this.carregarDificuldadeInicial();
        this.aplicarDificuldade(dificuldade);
      }) as EventListener);

      if ('BroadcastChannel' in window) {
        this.canalBroadcast = new BroadcastChannel(this.canalSincronizacao);
        this.canalBroadcast.onmessage = (evento: MessageEvent<{ tipo: string; estado?: Estado | null; dificuldade?: 'facil' | 'dificil' }>) => {
          if (evento.data?.tipo === 'estado-global') {
            this.aplicarEstadoGlobal(evento.data.estado ?? null);
            return;
          }

          if (evento.data?.tipo === 'dificuldade' && evento.data.dificuldade) {
            this.aplicarDificuldade(evento.data.dificuldade);
          }
        };
      }
    }

    const dificuldadeInicial = this.carregarDificuldadeInicial();
    this.dificuldadeAtual.set(dificuldadeInicial);

    const estadoInicial = this.obterEstadoInicial() ?? this.gerarNovoEstado();
    this.persistirEstadoGlobal(estadoInicial);
    this.estadoAtual.set(estadoInicial);

    this.sincronizarComBackend();
    this.syncDificuldadeFromBackend();

    if (typeof window !== 'undefined' && typeof window.setInterval === 'function') {
      this.timerSincronizacao = window.setInterval(() => {
        this.sincronizarComBackend();
        this.syncDificuldadeFromBackend();
      }, 1000);
    }
  }

  buscarEstadoAtual(): Observable<Estado> {
    const estadoInicial = this.obterEstadoInicial() ?? this.gerarNovoEstado();
    this.persistirEstadoGlobal(estadoInicial);
    this.estadoAtual.set(estadoInicial);

    if (typeof fetch === 'function') {
      return new Observable((observer) => {
        fetch(`${this.apiBaseUrl}/estado-atual`, { headers: { Accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro ao buscar estado atual: ${response.status}`);
            }
            return response.json() as Promise<Estado>;
          })
          .then((estado) => {
            this.persistirEstadoGlobal(estado);
            this.estadoAtual.set(estado);
            observer.next(estado);
            observer.complete();
          })
          .catch(() => {
            observer.next(estadoInicial);
            observer.complete();
          });
      });
    }

    return of(estadoInicial);
  }

  mudarEstado(): Observable<Estado> {
    if (typeof fetch === 'function') {
      return new Observable((observer) => {
        fetch(`${this.apiBaseUrl}/mudar-estado`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro ao mudar estado: ${response.status}`);
            }
            return response.json() as Promise<Estado>;
          })
          .then((proximoEstado) => {
            this.persistirEstadoGlobal(proximoEstado);
            this.estadoAtual.set(proximoEstado);
            observer.next(proximoEstado);
            observer.complete();
          })
          .catch(() => {
            const proximoEstado = this.gerarNovoEstado();
            this.persistirEstadoGlobal(proximoEstado);
            this.estadoAtual.set(proximoEstado);
            observer.next(proximoEstado);
            observer.complete();
          });
      });
    }

    const proximoEstado = this.gerarNovoEstado();
    this.persistirEstadoGlobal(proximoEstado);
    this.estadoAtual.set(proximoEstado);
    return of(proximoEstado);
  }

  mudarEstadoLocal(): Observable<Estado> {
    const proximoEstado = this.gerarNovoEstado();
    this.persistirEstadoLocal(proximoEstado);
    this.estadoAtual.set(proximoEstado);
    return of(proximoEstado);
  }

  private obterEstadoInicial(): Estado | null {
    const estadoGlobal = this.lerEstadoGlobal();
    const estadoLocal = this.lerEstadoLocal();

    if (!estadoGlobal) {
      return estadoLocal;
    }

    if (!estadoLocal) {
      return estadoGlobal;
    }

    return this.ultimaAtualizacaoLocal >= this.ultimaAtualizacaoGlobal ? estadoLocal : estadoGlobal;
  }

  private lerEstadoGlobal(): Estado | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const valor = window.localStorage.getItem(this.chaveEstadoGlobal);
    if (!valor) {
      return null;
    }

    try {
      return JSON.parse(valor) as Estado;
    } catch {
      return null;
    }
  }

  private lerEstadoLocal(): Estado | null {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return null;
    }

    const valor = window.sessionStorage.getItem(this.chaveEstadoLocal);
    if (!valor) {
      return null;
    }

    try {
      return JSON.parse(valor) as Estado;
    } catch {
      return null;
    }
  }

  private aplicarEstadoGlobal(estado: Estado | null): void {
    if (!estado) {
      this.estadoAtual.set(this.obterEstadoInicial());
      return;
    }

    this.ultimaAtualizacaoGlobal = Date.now();

    const estadoAtivo = this.obterEstadoInicial();

    try {
      this.estadoAtual.set(estadoAtivo ?? estado);
    } catch {
      this.estadoAtual.set(null);
    }
  }

  private sincronizarComBackend(): void {
    if (typeof fetch !== 'function') {
      const estado = this.obterEstadoInicial() ?? this.gerarNovoEstado();
      this.persistirEstadoGlobal(estado);
      this.estadoAtual.set(estado);
      return;
    }

    fetch(`${this.apiBaseUrl}/estado-atual`, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao sincronizar o estado: ${response.status}`);
        }
        return response.json() as Promise<Estado>;
      })
      .then((estado) => {
        this.persistirEstadoGlobal(estado);
        this.estadoAtual.set(this.obterEstadoInicial() ?? estado);
      })
      .catch(() => {
        const estadoFallback = this.obterEstadoInicial() ?? this.gerarNovoEstado();
        this.persistirEstadoGlobal(estadoFallback);
        this.estadoAtual.set(this.obterEstadoInicial() ?? estadoFallback);
      });
  }

  private syncDificuldadeFromBackend(): void {
    if (typeof fetch !== 'function') {
      return;
    }

    fetch(`${this.apiBaseUrl}/dificuldade-atual`, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao sincronizar a dificuldade: ${response.status}`);
        }
        return response.json() as Promise<{ dificuldade?: 'facil' | 'dificil' | string }>;
      })
      .then((payload) => {
        const dificuldade = payload?.dificuldade === 'dificil' ? 'dificil' : 'facil';
        if (this.dificuldadeAtual() !== dificuldade) {
          this.aplicarDificuldade(dificuldade);
        }
      })
      .catch(() => undefined);
  }

  private persistirEstadoGlobal(estado: Estado): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    this.ultimaAtualizacaoGlobal = Date.now();
    window.localStorage.setItem(this.chaveEstadoGlobal, JSON.stringify(estado));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jogo-mapa-sync', {
        detail: { estado }
      }));
    }

    if (this.canalBroadcast) {
      this.canalBroadcast.postMessage({ tipo: 'estado-global', estado });
    }
  }

  private persistirEstadoLocal(estado: Estado): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return;
    }

    this.ultimaAtualizacaoLocal = Date.now();
    window.sessionStorage.setItem(this.chaveEstadoLocal, JSON.stringify(estado));
  }

  private limparEstadoLocal(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return;
    }

    window.sessionStorage.removeItem(this.chaveEstadoLocal);
    this.ultimaAtualizacaoLocal = 0;
  }

  private gerarNovoEstado(): Estado {
    const indiceAleatorio = Math.floor(Math.random() * ESTADOS_BRASIL.length);
    const estado = ESTADOS_BRASIL[indiceAleatorio];

    return {
      sigla: estado.sigla,
      nome: estado.nome
    };
  }
}
