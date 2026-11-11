import '@angular/compiler';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JogoEstadosService } from '../../../service/jogo-estados.service';
import { agendarTrocaDeEstado, deveResetarFeedbackAoTrocarEstado, obterDicaEstado } from './jogo-aluno.component';

describe('agendarTrocaDeEstado', () => {
  it('deve agendar a troca de estado apenas após 5 segundos', () => {
    vi.useFakeTimers();

    try {
      const callback = vi.fn();

      agendarTrocaDeEstado(callback, 5000);

      vi.advanceTimersByTime(4999);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('obterDicaEstado', () => {
  it('deve informar a cor e o nome da região do estado', () => {
    expect(obterDicaEstado('SP', 'São Paulo')).toBe('O Estado São Paulo está na região azul (Sudeste)');
    expect(obterDicaEstado('AM', 'Amazonas')).toBe('O Estado Amazonas está na região roxa (Norte)');
    expect(obterDicaEstado('DF', 'Distrito Federal')).toBe('O Estado Distrito Federal está na região azul-claro (Centro-Oeste)');
  });
});

describe('JogoEstadosService', () => {
  beforeEach(() => {
    const storageMock = () => {
      const values = new Map<string, string>();
      return {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
        key: (index: number) => Array.from(values.keys())[index] ?? null,
        get length() { return values.size; }
      };
    };

    Object.defineProperty(globalThis, 'window', {
      value: {
        localStorage: storageMock(),
        sessionStorage: storageMock(),
        speechSynthesis: { cancel: vi.fn(), speak: vi.fn() },
        addEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      },
      configurable: true
    });
  });

  it('deve priorizar o estado global do professor quando ele foi atualizado depois do local do aluno', async () => {
    const estadoGlobal = { sigla: 'SP', nome: 'São Paulo' };
    const estadoLocal = { sigla: 'RJ', nome: 'Rio de Janeiro' };

    global.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => estadoGlobal
    })) as any;

    const service = new JogoEstadosService();
    globalThis.window.localStorage.setItem('jogo-mapa-estado-atual-global', JSON.stringify(estadoGlobal));
    globalThis.window.sessionStorage.setItem('jogo-mapa-estado-atual-local', JSON.stringify(estadoLocal));

    service['ultimaAtualizacaoGlobal'] = 2000;
    service['ultimaAtualizacaoLocal'] = 1000;

    service.iniciarSincronizacao();
    await Promise.resolve();

    expect(service.estadoAtual()).toEqual(estadoGlobal);
  });

  it('deve priorizar o estado local do aluno quando ele foi atualizado depois do global do professor', async () => {
    const estadoGlobal = { sigla: 'SP', nome: 'São Paulo' };
    const estadoLocal = { sigla: 'RJ', nome: 'Rio de Janeiro' };

    global.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => estadoGlobal
    })) as any;

    const service = new JogoEstadosService();
    globalThis.window.localStorage.setItem('jogo-mapa-estado-atual-global', JSON.stringify(estadoGlobal));
    globalThis.window.sessionStorage.setItem('jogo-mapa-estado-atual-local', JSON.stringify(estadoLocal));

    service['ultimaAtualizacaoGlobal'] = 1000;
    service['ultimaAtualizacaoLocal'] = 2000;

    service.iniciarSincronizacao();
    await Promise.resolve();

    expect(service.estadoAtual()).toEqual(estadoLocal);
  });
});

describe('deveResetarFeedbackAoTrocarEstado', () => {
  it('deve limpar a mensagem de acerto somente quando o mapa realmente mudar para outro estado', () => {
    expect(deveResetarFeedbackAoTrocarEstado(null, 'SP')).toBe(false);
    expect(deveResetarFeedbackAoTrocarEstado('SP', 'SP')).toBe(false);
    expect(deveResetarFeedbackAoTrocarEstado('SP', 'RJ')).toBe(true);
  });
});


