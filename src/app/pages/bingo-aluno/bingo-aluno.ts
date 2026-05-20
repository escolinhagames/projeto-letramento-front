import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-bingo-aluno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bingo-aluno.html',
  styleUrls: ['./bingo-aluno.scss']
})
export class BingoAlunoComponent implements OnInit, OnDestroy {
  // ✅ NOVO: lista de salas para o select
  salasAtivas: { codigo: string; professor: string }[] = [];
  codigoSala = '';
  meuNome = '';
  cartela: number[] = [];
  numerosSorteados = new Set<number>();
  numerosMarcados = new Set<number>();
  ultimoNumeroSorteado: number | null = null;
  numeroDisplay = '-';
  entrou = false;
  ganhou = false;
  intervalo: any;
  mensagem = '';
  mensagemTipo = '';

  animais: { [key: string]: string } = {
    '1-10': '🐕', '11-20': '🐈', '21-30': '🦆',
    '31-40': '🐄', '41-50': '🐷', '51-60': '🦊',
    '61-70': '🐯', '71-80': '🦁', '81-90': '🐘', '91-100': '🦒'
  };

  constructor(private bingoService: BingoService, private router: Router) {}

  ngOnInit() {
    // ✅ NOVO: carrega salas ativas ao entrar
    this.bingoService.listarSalasAtivas().subscribe({
      next: (salas) => this.salasAtivas = salas,
      error: () => this.mostrarMensagem('Erro ao carregar salas', 'error')
    });
  }

  ngOnDestroy() {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  obterAnimal(numero: number): string {
    const intervalo = Math.floor((numero - 1) / 10) * 10 + 1;
    const max = intervalo + 9;
    return this.animais[`${intervalo}-${max}`] || '🦁';
  }

  get cartelaGrid(): number[][] {
    const sorted = [...this.cartela].sort((a, b) => a - b);
    const grid: number[][] = [];
    for (let i = 0; i < 5; i++) {
      grid.push(sorted.slice(i * 5, i * 5 + 5));
    }
    return grid;
  }

  get progresso(): number {
    return this.cartela.length === 0 ? 0 :
      Math.round((this.numerosMarcados.size / this.cartela.length) * 100);
  }

  entrarSala() {
    if (!this.codigoSala.trim() || !this.meuNome.trim()) {
      this.mostrarMensagem('Selecione uma sala e digite seu nome', 'error');
      return;
    }
    this.bingoService.entrarSala(this.codigoSala, this.meuNome).subscribe({
      next: (data: any) => {
        this.cartela = data.cartela;
        this.entrou = true;
        this.monitorar();
        this.intervalo = setInterval(() => this.monitorar(), 2000);
      },
      error: () => this.mostrarMensagem('Erro ao entrar na sala', 'error')
    });
  }

  monitorar() {
    this.bingoService.obterSala(this.codigoSala).subscribe({
      next: (data: any) => {
        const sorteados: number[] = data.sorteados || [];
        this.numerosSorteados = new Set(sorteados);
        if (sorteados.length > 0) {
          const ultimo = sorteados[sorteados.length - 1];
          if (ultimo !== this.ultimoNumeroSorteado) {
            this.ultimoNumeroSorteado = ultimo;
            this.numeroDisplay = String(ultimo);
            this.falarNumero(ultimo);
          }
        } else {
          this.numeroDisplay = '-';
          this.ultimoNumeroSorteado = null;
        }
      }
    });
  }

  marcar(numero: number) {
    if (!this.numerosSorteados.has(numero) || this.ganhou) return;
    if (this.numerosMarcados.has(numero)) {
      this.numerosMarcados.delete(numero);
      this.bingoService.desmarcarNumero(this.codigoSala, this.meuNome, numero).subscribe();
    } else {
      this.numerosMarcados.add(numero);
      this.bingoService.marcarNumero(this.codigoSala, this.meuNome, numero).subscribe();
    }
    if (this.numerosMarcados.size === this.cartela.length && !this.ganhou) {
      this.ganhou = true;
      this.bingoService.verificarBingo(this.codigoSala, this.meuNome).subscribe({
        next: (data: any) => { if (data.bingo) alert('🎉 BINGO! Você ganhou!'); }
      });
    }
  }

  estaMarc(n: number): boolean { return this.numerosMarcados.has(n); }
  estaSorteado(n: number): boolean { return this.numerosSorteados.has(n); }

  falarNumero(numero: number) {
    const msg = new SpeechSynthesisUtterance(`Número ${numero}`);
    msg.lang = 'pt-BR'; msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  sair() {
    if (confirm('Deseja sair da sala?')) {
      if (this.intervalo) clearInterval(this.intervalo);
      this.router.navigate(['/aluno-dashboard']);
    }
  }

  mostrarMensagem(msg: string, tipo: string) {
    this.mensagem = msg; this.mensagemTipo = tipo;
    setTimeout(() => this.mensagem = '', 4000);
  }
}
