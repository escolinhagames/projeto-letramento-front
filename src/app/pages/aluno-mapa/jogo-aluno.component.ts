import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { MapaBrasilComponent } from '../mapa-brasil/mapa-brasil.component';
import { JogoEstadosService } from '../../../service/jogo-estados.service';

/**
 * Tela do aluno: mostra o nome do estado sorteado e o mapa clicável.
 * O aluno clica no estado correspondente; o jogo informa acerto/erro.
 * A troca de rodada é feita pelo professor (tela separada) e chega
 * aqui automaticamente via JogoEstadosService.
 */
@Component({
  selector: 'app-jogo-aluno',
  standalone: true,
  imports: [MapaBrasilComponent, UpperCasePipe],
  templateUrl: './jogo-aluno.component.html',
  styleUrl: './jogo-aluno.component.scss'
})
export class JogoAlunoComponent implements OnInit {
  private readonly jogoService = inject(JogoEstadosService);
  private ultimaSiglaFalada: string | null = null;

  readonly estadoAtual = this.jogoService.estadoAtual;
  readonly siglaSelecionada = signal<string | null>(null);
  readonly acertou = signal<boolean | null>(null);

  constructor() {
    // Sempre que o estado da rodada mudar (o professor clicou em "Mudar estado"),
    // limpa o feedback da rodada anterior para começar do zero.
    effect(() => {
      const estado = this.estadoAtual();

      this.siglaSelecionada.set(null);
      this.acertou.set(null);

      if (!estado) {
        return;
      }

      if (this.ultimaSiglaFalada === null) {
        this.ultimaSiglaFalada = estado.sigla;
        return;
      }

      if (this.ultimaSiglaFalada !== estado.sigla) {
        this.falarNomeDoEstado(estado.nome);
        this.ultimaSiglaFalada = estado.sigla;
      }
    });
  }

  ngOnInit(): void {
    this.jogoService.iniciarSincronizacao();
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
      return; // já acertou nesta rodada; aguarda o professor trocar o estado
    }

    this.siglaSelecionada.set(sigla);
    this.acertou.set(sigla === alvo.sigla);
  }
}
