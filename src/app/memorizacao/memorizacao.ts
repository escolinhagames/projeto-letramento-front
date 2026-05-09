import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memorizacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memorizacao.html',
  styleUrls: ['./memorizacao.css']
})
export class MemorizacaoComponent {

  cartas: any[] = [];
  cartasViradas: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.iniciarJogo();
  }

  iniciarJogo() {
    this.cartas = [
      { par: 'cachorro', conteudo: '🐶', tipo: 'icone', virada: false, encontrada: false },
      { par: 'cachorro', conteudo: 'CACHORRO', tipo: 'texto', virada: false, encontrada: false },

      { par: 'maca', conteudo: '🍎', tipo: 'icone', virada: false, encontrada: false },
      { par: 'maca', conteudo: 'MAÇÃ', tipo: 'texto', virada: false, encontrada: false },

      { par: 'carro', conteudo: '🚗', tipo: 'icone', virada: false, encontrada: false },
      { par: 'carro', conteudo: 'CARRO', tipo: 'texto', virada: false, encontrada: false },

      { par: 'bola', conteudo: '⚽', tipo: 'icone', virada: false, encontrada: false },
      { par: 'bola', conteudo: 'BOLA', tipo: 'texto', virada: false, encontrada: false },

      { par: 'gato', conteudo: '🐱', tipo: 'icone', virada: false, encontrada: false },
      { par: 'gato', conteudo: 'GATO', tipo: 'texto', virada: false, encontrada: false },

      { par: 'sol', conteudo: '🌞', tipo: 'icone', virada: false, encontrada: false },
      { par: 'sol', conteudo: 'SOL', tipo: 'texto', virada: false, encontrada: false },

      { par: 'banana', conteudo: '🍌', tipo: 'icone', virada: false, encontrada: false },
      { par: 'banana', conteudo: 'BANANA', tipo: 'texto', virada: false, encontrada: false },

      { par: 'bicicleta', conteudo: '🚲', tipo: 'icone', virada: false, encontrada: false },
      { par: 'bicicleta', conteudo: 'BICICLETA', tipo: 'texto', virada: false, encontrada: false }
    ];

    this.embaralhar();
  }

  embaralhar() {
    this.cartas.sort(() => Math.random() - 0.5);
  }

  virarCarta(carta: any) {
    if (carta.virada || carta.encontrada || this.cartasViradas.length === 2) {
      return;
    }

    carta.virada = true;
    this.cartasViradas.push(carta);
    this.cdr.detectChanges();

    if (this.cartasViradas.length == 2) {
      this.verificarPar();
    }
  }

  verificarPar() {
    const [carta1, carta2] = this.cartasViradas;

    if (carta1.par === carta2.par) {
      carta1.encontrada = true;
      carta2.encontrada = true;
      this.cartasViradas = [];
      this.cdr.detectChanges();
    } else {
      // Espera 600ms (tempo da animação) para mostrar que está errado (vermelho)
      setTimeout(() => {
        carta1.erro = true;
        carta2.erro = true;
        this.cdr.detectChanges();

        // Espera os 1,5 segundos (1500ms) que você pediu antes de desvirar as cartas
        setTimeout(() => {
          carta1.virada = false;
          carta2.virada = false;
          carta1.erro = false;
          carta2.erro = false;
          this.cartasViradas = [];
          this.cdr.detectChanges();
        }, 1000);
      }, 600);
    }
  }
}
