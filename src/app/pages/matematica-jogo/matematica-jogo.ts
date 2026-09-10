import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatematicaService } from '../../services/matematica.service';

@Component({
  selector: 'app-matematica-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matematica-jogo.html',
  styleUrls: ['./matematica-jogo.scss']
})
export class MatematicaJogoComponent implements OnInit {
  salaId = 0;
  questao: any = null;
  respostaSelecionada: string | null = null;
  resultado: 'acerto' | 'erro' | null = null;
  acertos = 0;
  erros = 0;
  maxAcertos = 5;
  maxErros = 3;
  // ✅ NOVO: modal de fim de jogo
  jogoEncerrado = false;
  mensagemFinal = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MatematicaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.salaId = Number(this.route.snapshot.paramMap.get('id'));

    // pega limites da sala
    const maxA = this.route.snapshot.queryParamMap.get('maxAcertos');
    const maxE = this.route.snapshot.queryParamMap.get('maxErros');
    if (maxA) this.maxAcertos = Number(maxA);
    if (maxE) this.maxErros = Number(maxE);

    this.carregarQuestao();
    setTimeout(() => {
      this.falar('Resolva a conta e escolha a resposta correta!');
    }, 600);
  }

  carregarQuestao() {
    this.questao = null;
    this.respostaSelecionada = null;
    this.resultado = null;
    this.service.gerarQuestao(this.salaId).subscribe({
      next: (data) => {
        this.questao = data;
        this.cdr.detectChanges();
        this.falarQuestao();
      },
      error: () => this.router.navigate(['/matematica/aluno'])
    });
  }

  falarQuestao() {
    if (!this.questao) return;
    const expressao = this.questao.expressao
      .replace(/×/g, 'vezes')
      .replace(/÷/g, 'dividido por')
      .replace(/\+/g, 'mais')
      .replace(/-/g, 'menos');
    this.falar(`Quanto é ${expressao}?`);
  }

  selecionar(alternativa: string) {
    if (this.resultado || this.jogoEncerrado) return;
    this.respostaSelecionada = alternativa;

    const correto = Number(alternativa) === this.questao.resultado;

    if (correto) {
      this.resultado = 'acerto';
      this.acertos++;
      this.falar('Parabéns! Você acertou!');

      // ✅ verifica limite de acertos
      if (this.acertos >= this.maxAcertos) {
        setTimeout(() => this.encerrarJogo('acertos'), 1200);
        return;
      }
    } else {
      this.resultado = 'erro';
      this.erros++;
      this.falar('Errou! Tente outra.');

      // ✅ verifica limite de erros
      if (this.erros >= this.maxErros) {
        setTimeout(() => this.encerrarJogo('erros'), 1200);
        return;
      }

      setTimeout(() => {
        this.respostaSelecionada = null;
        this.resultado = null;
        this.cdr.detectChanges();
      }, 1500);
    }
    this.cdr.detectChanges();
  }

  encerrarJogo(motivo: 'acertos' | 'erros') {
    this.jogoEncerrado = true;
    if (motivo === 'acertos') {
      this.mensagemFinal = `Parabéns! Você acertou ${this.acertos} questões! Atividade concluída!`;
    } else {
      this.mensagemFinal = `Atividade encerrada. Você acertou ${this.acertos} e errou ${this.erros}. Continue praticando!`;
    }
    this.falar(this.mensagemFinal);
    this.cdr.detectChanges();
  }

  proximaQuestao() {
    this.carregarQuestao();
  }

  voltarParaSalas() {
    this.router.navigate(['/matematica/aluno']);
  }

  falar(texto: string) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR'; msg.rate = 0.85; msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  }

  voltar() { this.router.navigate(['/matematica/aluno']); }
}
