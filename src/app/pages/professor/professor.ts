import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-professor',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './professor.html',
  styleUrls: ['./professor.scss']
})
export class ProfessorComponent {

  nomeProfessor = '';
  codigoSala = '';
  mensagem = '';

  constructor(private router: Router, private bingoService: BingoService) {}

  criarSala() {
    if (!this.nomeProfessor.trim()) {
      this.mensagem = 'Digite seu nome de professor';
      return;
    }

    this.bingoService.criarSala(this.nomeProfessor).subscribe({
      next: (response: any) => {
        this.codigoSala = response.codigo;
        this.mensagem = `Sala criada com sucesso! Código: ${this.codigoSala}`;
        localStorage.setItem('professorNome', this.nomeProfessor);
        localStorage.setItem('salaCodigo', this.codigoSala);
      },
      error: (error) => {
        this.mensagem = 'Erro ao criar sala: ' + error.message;
      }
    });
  }

  irParaJogo() {
    if (this.codigoSala) {
      this.router.navigate(['/bingo/jogo'], {
        queryParams: { codigo: this.codigoSala, tipo: 'professor' }
      });
    }
  }
}
