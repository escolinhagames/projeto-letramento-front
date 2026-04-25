import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-aluno',
  imports: [FormsModule, CommonModule],
  templateUrl: './aluno.html',
  styleUrl: './aluno.scss',
})
export class AlunoComponent implements OnInit {

  nome = '';
  codigoSala = '';
  mensagem = '';
  cartela: number[] = [];
  autoNomeCounter = 1;

  constructor(private router: Router, private bingoService: BingoService) {}

  ngOnInit() {
    this.carregarContador();
  }

  carregarContador() {
    const valor = localStorage.getItem('alunoAutoNome');
    this.autoNomeCounter = valor ? Number(valor) : 1;
  }

  salvarContador() {
    localStorage.setItem('alunoAutoNome', String(this.autoNomeCounter));
  }

  selecionarSala(codigo: string) {
    this.codigoSala = codigo;
    this.mensagem = `Sala selecionada: ${codigo}`;
  }

  gerarNomeAutomatico(): string {
    const nome = `Jogador ${this.autoNomeCounter}`;
    this.autoNomeCounter += 1;
    this.salvarContador();
    return nome;
  }

  entrar() {
    if (!this.codigoSala.trim()) {
      this.mensagem = 'Selecione ou digite o código da sala';
      return;
    }

    if (!this.nome.trim()) {
      this.nome = this.gerarNomeAutomatico();
    }

    this.bingoService.entrarSala(this.codigoSala, this.nome).subscribe({
      next: (response: any) => {
        this.cartela = response.cartela;
        this.mensagem = response.mensagem;
        localStorage.setItem('alunoNome', this.nome);
        localStorage.setItem('salaCodigo', this.codigoSala);
        localStorage.setItem('cartela', JSON.stringify(this.cartela));

        // Redirecionar para o jogo após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/bingo/jogo'], {
            queryParams: { codigo: this.codigoSala, tipo: 'aluno', nome: this.nome }
          });
        }, 2000);
      },
      error: (error) => {
        this.mensagem = 'Erro ao entrar na sala: ' + error.message;
      }
    });
  }
}
