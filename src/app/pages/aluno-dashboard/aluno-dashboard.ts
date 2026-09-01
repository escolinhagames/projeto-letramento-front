import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-aluno-dashboard',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './aluno-dashboard.html',
  styleUrls: ['./aluno-dashboard.scss']
})
export class AlunoDashboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => this.falar('Escolha um jogo'), 600);

    document.addEventListener('touchstart', () => {
      this.falar('Escolha um jogo');
    }, { once: true });
  }

  falar(texto: string, event?: Event) {
    if (event) event.stopPropagation(); // evita selecionar o jogo ao clicar no 🔊
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    msg.rate = 0.85;
    msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  }

  selecionarJogo(jogo: number) {
    if (jogo === 1) { this.router.navigate(['/bingo/aluno']); return; }
    if (jogo === 2) { this.router.navigate(['/embaralhar/aluno']); return; }
    if (jogo === 3) { this.router.navigate(['/memorizacao']); return; }
    if (jogo === 4) { this.router.navigate(['/aluno-imagem']); return; }
  }

  voltar() { this.router.navigate(['/']); }
}
