import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmbaralharService } from '../../services/embaralhar.service';

@Component({
  selector: 'app-embaralhar-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './embaralhar-jogo.html',
  styleUrls: ['./embaralhar-jogo.scss']
})
export class EmbaralharJogoComponent implements OnInit {
  jogo: any = null;
  imageBase64 = '';
  shuffledLetters: string[] = [];
  usedIndexes: number[] = [];
  currentAnswer = '';
  mensagem = '';
  sucesso = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private embaralharService: EmbaralharService,
    private cdr: ChangeDetectorRef // ✅ ADICIONADO
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.embaralharService.obterJogo(id).subscribe({
      next: (data) => {
        this.jogo = data;
        this.imageBase64 = data.imagemBase64;
        this.embaralharLetras();
        this.cdr.detectChanges(); // ✅ ADICIONADO
      },
      error: () => this.router.navigate(['/embaralhar/aluno'])
    });
  }

  get dificuldadeTexto(): string {
    if (!this.jogo) return '';
    return this.jogo.difficulty === 'HARD' ? 'Difícil' : 'Fácil';
  }

  embaralharLetras() {
    let letters = this.jogo.word.toUpperCase().split('');
    if (this.jogo.difficulty === 'HARD') {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < 3; i++) {
        letters.push(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
      }
    }
    this.shuffledLetters = this.shuffle(letters);
  }

  shuffle(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  selecionarLetra(index: number) {
    if (this.usedIndexes.includes(index) || this.sucesso) return;
    this.currentAnswer += this.shuffledLetters[index];
    this.usedIndexes.push(index);
    this.cdr.detectChanges(); // ✅ ADICIONADO
  }

  limpar() {
    if (this.sucesso) return;
    this.currentAnswer = '';
    this.usedIndexes = [];
    this.cdr.detectChanges(); // ✅ ADICIONADO
  }

  get podeEnviar(): boolean {
    if (this.sucesso) return false;
    const required = this.jogo?.difficulty === 'HARD'
      ? this.jogo.word.length
      : this.shuffledLetters.length;
    return this.currentAnswer.length === required;
  }

  enviar() {
    this.embaralharService.enviarResposta(this.jogo.id, this.currentAnswer).subscribe({
      next: (data: any) => {
        this.sucesso = data.correct;
        this.mensagem = data.correct
          ? '🎉 Parabéns! Você acertou!'
          : '❌ Errado! Tente novamente.';
        if (!data.correct) this.limpar();
        this.cdr.detectChanges(); // ✅ ADICIONADO
      },
      error: () => this.mensagem = 'Erro ao enviar resposta'
    });
  }

  falar(texto: string) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR'; msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  voltar() { this.router.navigate(['/embaralhar/aluno']); }
}
