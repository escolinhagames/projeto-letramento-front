import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { ESTADOS_BRASIL } from '../mapa-brasil/estados-brasil.data';
import { MapaBrasilComponent } from '../mapa-brasil/mapa-brasil.component';
import { JogoEstadosService } from '../../../service/jogo-estados.service';

const REGIOES_ESTADO: Record<string, { nome: string; cor: string }> = {
  AC: { nome: 'Norte', cor: 'azul' },
  AL: { nome: 'Nordeste', cor: 'amarela' },
  AP: { nome: 'Norte', cor: 'azul' },
  AM: { nome: 'Norte', cor: 'roxa' },
  BA: { nome: 'Nordeste', cor: 'amarela' },
  CE: { nome: 'Nordeste', cor: 'amarela' },
  DF: { nome: 'Centro-Oeste', cor: 'azul-claro' },
  ES: { nome: 'Sudeste', cor: 'azul' },
  GO: { nome: 'Centro-Oeste', cor: 'azul-claro' },
  MA: { nome: 'Nordeste', cor: 'amarela' },
  MG: { nome: 'Sudeste', cor: 'azul' },
  MS: { nome: 'Centro-Oeste', cor: 'azul-claro' },
  MT: { nome: 'Centro-Oeste', cor: 'azul-claro' },
  PA: { nome: 'Norte', cor: 'roxa' },
  PB: { nome: 'Nordeste', cor: 'amarela' },
  PE: { nome: 'Nordeste', cor: 'amarela' },
  PI: { nome: 'Nordeste', cor: 'amarela' },
  PR: { nome: 'Sul', cor: 'azul-violeta' },
  RJ: { nome: 'Sudeste', cor: 'azul' },
  RN: { nome: 'Nordeste', cor: 'amarela' },
  RO: { nome: 'Norte', cor: 'roxa' },
  RR: { nome: 'Norte', cor: 'roxa' },
  RS: { nome: 'Sul', cor: 'azul-violeta' },
  SC: { nome: 'Sul', cor: 'azul-violeta' },
  SE: { nome: 'Nordeste', cor: 'amarela' },
  SP: { nome: 'Sudeste', cor: 'azul' },
  TO: { nome: 'Norte', cor: 'roxa' }
};

export function agendarTrocaDeEstado(callback: () => void, atrasoMs = 5000): number {
  return globalThis.setTimeout(callback, atrasoMs);
}

export function obterDicaEstado(sigla: string, nome?: string): string {
  const estado = REGIOES_ESTADO[sigla];

  if (!estado) {
    return 'O Estado está em uma região não mapeada.';
  }

  const nomeEstado = nome ?? ESTADOS_BRASIL.find((item) => item.sigla === sigla)?.nome ?? sigla;
  const nomeRegiao = estado.nome;
  const corDescricao = estado.cor;

  return `O Estado ${nomeEstado} está na região ${corDescricao} (${nomeRegiao})`;
}

export function deveResetarFeedbackAoTrocarEstado(estadoAnterior: string | null, novoEstado: string | null): boolean {
  if (!estadoAnterior || !novoEstado) {
    return false;
  }

  return estadoAnterior !== novoEstado;
}

/**
 * Tela do aluno: mostra o nome do estado sorteado e o mapa clicável.
 * O aluno clica no estado correspondente; o jogo informa acerto/erro.
 * Quando acerta, a rodada avança sozinha após 5 segundos.
 */
@Component({
  selector: 'app-jogo-aluno',
  standalone: true,
  imports: [MapaBrasilComponent, UpperCasePipe],
  templateUrl: './jogo-aluno.component.html',
  styleUrl: './jogo-aluno.component.scss'
})
export class JogoAlunoComponent implements OnInit, OnDestroy {
  private readonly jogoService = inject(JogoEstadosService);
  private ultimaSiglaFalada: string | null = null;
  private timerProximaRodada: number | null = null;

  readonly estadoAtual = this.jogoService.estadoAtual;
  readonly siglaSelecionada = signal<string | null>(null);
  readonly acertou = signal<boolean | null>(null);
  readonly mostrarDica = signal(false);

  constructor() {
    effect(() => {
      const estado = this.estadoAtual();

      if (!estado) {
        return;
      }

      if (this.ultimaSiglaFalada === null) {
        this.ultimaSiglaFalada = estado.sigla;
        this.siglaSelecionada.set(null);
        return;
      }

      if (deveResetarFeedbackAoTrocarEstado(this.ultimaSiglaFalada, estado.sigla)) {
        this.siglaSelecionada.set(null);
        this.acertou.set(null);
        this.falarNomeDoEstado(estado.nome);
        this.ultimaSiglaFalada = estado.sigla;
      }
    });

    effect(() => {
      const dificuldade = this.jogoService.dificuldadeAtual();
      this.mostrarDica.set(dificuldade === 'facil');
    });
  }

  ngOnInit(): void {
    this.jogoService.iniciarSincronizacao();
  }

  ngOnDestroy(): void {
    if (this.timerProximaRodada !== null) {
      clearTimeout(this.timerProximaRodada);
      this.timerProximaRodada = null;
    }
  }

  private agendarProximaRodada(): void {
    if (this.timerProximaRodada !== null) {
      clearTimeout(this.timerProximaRodada);
    }

    this.timerProximaRodada = agendarTrocaDeEstado(() => {
      this.timerProximaRodada = null;
      this.mostrarDica.set(false);
      this.jogoService.mudarEstado().subscribe({
        error: (erro) => console.error('Falha ao trocar para o próximo estado do aluno:', erro)
      });
    }, 5000);
  }

  getDicaAtual(): string {
    const estado = this.estadoAtual();
    if (!estado) {
      return 'O Estado está na região ainda sendo sorteada.';
    }

    return obterDicaEstado(estado.sigla, estado.nome);
  }

  private falarNomeDoEstado(nome: string): void {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const mensagem = new SpeechSynthesisUtterance(nome);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 0.9;
    mensagem.pitch = 1.1;
    window.speechSynthesis.speak(mensagem);
  }

  onEstadoClicado(sigla: string): void {
    const alvo = this.estadoAtual();
    if (!alvo || this.acertou() === true) {
      return; // já acertou nesta rodada; aguarda a troca automática
    }

    this.siglaSelecionada.set(sigla);
    const respondeuCorretamente = sigla === alvo.sigla;
    this.acertou.set(respondeuCorretamente);

    if (respondeuCorretamente) {
      this.agendarProximaRodada();
    }
  }
}
