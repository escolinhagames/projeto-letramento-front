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

  nome = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  selecionarJogo(jogo: number) {
    if (jogo === 1) {
      // ✅ ALTERADO: era window.location.href para o Railway, agora navega no Angular
      this.router.navigate(['/bingo/aluno']);
      return;
    }
    if (jogo === 2) {
      // ✅ ALTERADO: era window.location.href para o Railway, agora navega no Angular
      this.router.navigate(['/embaralhar/aluno']);
      return;
    }
    if (jogo === 3) {
      this.router.navigate(['/memorizacao']);
      return;
    }
    if (jogo === 4) {
      this.router.navigate(['/aluno-imagem']);
      return;
    }
    alert('Esse jogo ainda não está disponível.');
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
