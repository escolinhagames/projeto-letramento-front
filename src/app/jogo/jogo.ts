import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jogo',
  imports: [CommonModule],
  templateUrl: './jogo.html',
  styleUrl: './jogo.scss',
})
export class JogoComponent implements OnInit {
  game: any = {};
  imageBase64 = '';
  mensagem: string | null = null;
  sucesso = false;
  attempt: any = null;
  currentAnswer = '';
  shuffledLetters: string[] = [];
  usedIndexes: number[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // TODO: Carregar jogo por ID
    this.initializeGame();
  }

  initializeGame() {
    // Simulação
    this.game = { id: 1, word: 'TESTE', difficulty: 'EASY' };
    this.shuffleLetters();
  }

  shuffleLetters() {
    const letters = this.game.word.toUpperCase().split('');
    if (this.game.difficulty === 'HARD') {
      // Adicionar letras extras
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < 3; i++) {
        letters.push(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
      }
    }
    this.shuffledLetters = this.shuffleArray(letters);
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  selectLetter(index: number) {
    if (this.usedIndexes.includes(index) || this.sucesso) return;
    this.currentAnswer += this.shuffledLetters[index];
    this.usedIndexes.push(index);
  }

  clearSelection() {
    if (this.sucesso) return;
    this.currentAnswer = '';
    this.usedIndexes = [];
  }

  canSubmit(): boolean {
    if (this.sucesso) return false;
    const requiredLength = this.game.difficulty === 'HARD' ? this.game.word.length : this.shuffledLetters.length;
    return this.currentAnswer.length === requiredLength;
  }

  enviarResposta() {
    // TODO: Enviar resposta
    this.sucesso = this.currentAnswer.toUpperCase() === this.game.word.toUpperCase();
    this.mensagem = this.sucesso ? 'Parabéns!' : 'Tente novamente!';
    this.attempt = { studentAnswer: this.currentAnswer, attemptedAt: new Date() };
  }
}
