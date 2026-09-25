import { Component, input, output } from '@angular/core';
import { ESTADOS_BRASIL, MAPA_BRASIL_VIEWBOX } from './estados-brasil.data';

/**
 * Mapa do Brasil com os 26 estados + Distrito Federal como áreas clicáveis.
 * Reutilizado tanto na tela do aluno (interativo) quanto na do professor
 * (somente visual, sem responder à pergunta).
 */
@Component({
  selector: 'app-mapa-brasil',
  standalone: true,
  templateUrl: './mapa-brasil.component.html',
  styleUrl: './mapa-brasil.component.scss'
})
export class MapaBrasilComponent {
  /** Quando falso (tela do professor), cliques nos estados são ignorados. */
  readonly interativo = input<boolean>(true);

  /** Sigla que o aluno acabou de clicar, para exibir o destaque de acerto/erro. */
  readonly siglaSelecionada = input<string | null>(null);

  /** true = acertou, false = errou, null = nenhuma seleção ainda. */
  readonly acertou = input<boolean | null>(null);

  /** Emite a sigla do estado clicado (somente quando interativo = true). */
  readonly estadoClicado = output<string>();

  readonly estados = ESTADOS_BRASIL;
  readonly viewBox = MAPA_BRASIL_VIEWBOX;

  private readonly regioes: Record<string, string> = {
    // Norte: roxo suave, para evitar o vermelho que é usado no feedback de erro
    AC: '#c4a1ff',
    AM: '#b892ff',
    AP: '#d0b4ff',
    PA: '#b48af5',
    RO: '#caa8ff',
    RR: '#d5b5ff',
    TO: '#a77ef2',

    // Nordeste: amarelo / laranja suave
    AL: '#f9d77a',
    BA: '#f8c96e',
    CE: '#f7d98a',
    MA: '#f7c76d',
    PB: '#f8dca0',
    PE: '#f6d778',
    PI: '#f7c76d',
    RN: '#f9d98a',
    SE: '#f8ce82',

    // Sudeste: azul / ciano
    ES: '#9ad8ff',
    MG: '#8ec9ff',
    RJ: '#7cc0ff',
    SP: '#9ed8ff',

    // Sul: roxo / azul-violeta
    PR: '#b9c8ff',
    RS: '#a8b9ff',
    SC: '#c2d0ff',

    // Centro-Oeste: tons claros tipo gelo/ice, mais escuros para diferenciar do azul do Sudeste
    DF: '#bfe0f5',
    GO: '#cfeaf9',
    MS: '#b9dff5',
    MT: '#afd8ee'
  };

  getCorEstado(sigla: string): string {
    const corBase = this.regioes[sigla] ?? '#7ed4ff';
    return corBase;
  }

  onEstadoClick(sigla: string): void {
    if (!this.interativo()) {
      return;
    }
    this.estadoClicado.emit(sigla);
  }
}
