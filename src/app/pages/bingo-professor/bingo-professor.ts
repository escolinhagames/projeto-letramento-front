import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-bingo-professor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bingo-professor.html',
  styleUrls: ['./bingo-professor.scss']
})
export class BingoProfessorComponent implements OnInit, OnDestroy {
  nomeProfessor = '';
  codigoSala = '';
  numeroDisplay = '-';
  totalSorteados = 0;
  totalAlunos = 0;
  sorteados: number[] = [];
  alunos: string[] = [];
  alunosBingo: { [nome: string]: boolean } = {};
  cartelaProfessor: number[] = [];
  salaCriada = false;
  mensagem = '';
  mensagemTipo = '';
  // ✅ NOVO: flag para evitar sala fantasma
  criando = false;
  intervalo: any;

  animais: { [key: string]: string } = {
    '1-10': '🐕', '11-20': '🐈', '21-30': '🦆',
    '31-40': '🐄', '41-50': '🐷', '51-60': '🦊',
    '61-70': '🐯', '71-80': '🦁', '81-90': '🐘', '91-100': '🦒'
  };

  constructor(private bingoService: BingoService, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  obterAnimal(numero: number): string {
    const intervalo = Math.floor((numero - 1) / 10) * 10 + 1;
    const max = intervalo + 9;
    return this.animais[`${intervalo}-${max}`] || '🦁';
  }

  get cartelaGrid(): number[][] {
    const sorted = [...this.cartelaProfessor].sort((a, b) => a - b);
    const grid: number[][] = [];
    for (let i = 0; i < 5; i++) grid.push(sorted.slice(i * 5, i * 5 + 5));
    return grid;
  }

  criarSala() {
    // ✅ NOVO: evita duplo clique
    if (this.criando || this.salaCriada) return;
    if (!this.nomeProfessor.trim()) {
      this.mostrarMensagem('Por favor, insira seu nome', 'error');
      return;
    }
    this.criando = true;
    this.bingoService.criarSala(this.nomeProfessor).subscribe({
      next: (data: any) => {
        this.codigoSala = data.codigo;
        this.salaCriada = true;
        this.carregarSala();
        this.intervalo = setInterval(() => this.carregarSala(), 2000);
        this.mostrarMensagem(`Sala ${data.codigo} criada!`, 'success');
      },
      error: () => {
        this.mostrarMensagem('Erro ao criar sala', 'error');
        this.criando = false;
      }
    });
  }

  carregarSala() {
    this.bingoService.obterSala(this.codigoSala).subscribe({
      next: (data: any) => {
        this.sorteados = data.sorteados || [];
        this.totalSorteados = data.totalSorteados || 0;
        this.totalAlunos = data.totalAlunos || 0;
        this.alunos = Array.from(data.alunos || []);
        this.cartelaProfessor = data.cartelaProfessor || [];
        // ✅ CORRIGIDO: mostra o último número corretamente
        if (this.sorteados.length > 0) {
          this.numeroDisplay = String(this.sorteados[this.sorteados.length - 1]);
        }
        this.alunos.forEach(aluno => this.verificarBingoAluno(aluno));
      }
    });
  }

  verificarBingoAluno(nome: string) {
    this.bingoService.verificarBingo(this.codigoSala, nome).subscribe({
      next: (data: any) => { this.alunosBingo[nome] = data.bingo; }
    });
  }

  sortear() {
    this.bingoService.sortearNumero(this.codigoSala).subscribe({
      next: (data: any) => {
        // ✅ CORRIGIDO: atualiza número imediatamente após sortear, sem esperar o intervalo
        this.numeroDisplay = String(data.numero);
        this.totalSorteados = data.totalSorteados;
        this.sorteados = Array.from(data.sorteados || []);
      },
      error: () => this.mostrarMensagem('Erro ao sortear', 'error')
    });
  }

  resetar() {
    if (!confirm('Deseja iniciar um novo jogo?')) return;
    this.bingoService.resetarSala(this.codigoSala).subscribe({
      next: () => {
        this.numeroDisplay = '-';
        this.totalSorteados = 0;
        this.sorteados = [];
        this.mostrarMensagem('Novo jogo iniciado!', 'success');
      }
    });
  }

  encerrar() {
    if (!confirm('Deseja encerrar a sala?')) return;
    this.bingoService.encerrarSala(this.codigoSala).subscribe({
      next: () => this.router.navigate(['/dashboard'])
    });
  }

  mostrarMensagem(msg: string, tipo: string) {
    this.mensagem = msg; this.mensagemTipo = tipo;
    setTimeout(() => this.mensagem = '', 4000);
  }

  voltar() { this.router.navigate(['/dashboard']); }
}
