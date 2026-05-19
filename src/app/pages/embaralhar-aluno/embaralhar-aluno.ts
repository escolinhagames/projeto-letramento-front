import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmbaralharService } from '../../services/embaralhar.service';

@Component({
  selector: 'app-embaralhar-aluno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './embaralhar-aluno.html',
  styleUrls: ['./embaralhar-aluno.scss']
})
export class EmbaralharAlunoComponent implements OnInit {
  jogos: any[] = [];
  mensagem = '';

  constructor(private embaralharService: EmbaralharService, private router: Router) {}

  ngOnInit() {
    this.embaralharService.listarJogosAluno().subscribe({
      next: (data) => this.jogos = data,
      error: () => this.mensagem = 'Erro ao carregar jogos'
    });
  }

  jogar(id: number) {
    this.router.navigate(['/embaralhar/aluno/jogo', id]);
  }

  voltar() { this.router.navigate(['/aluno-dashboard']); }
}
