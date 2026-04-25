import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BingoService } from '../../services/bingo.service';

@Component({
  selector: 'app-bingo-jogo',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './bingo-jogo.html',
  styleUrls: ['./bingo-jogo.scss']
})
export class BingoJogoComponent implements OnInit, OnDestroy {

  tipo: string = ''; // 'professor' ou 'aluno'
  codigoSala: string = '';
  nomeUsuario: string = '';
  cartela: number[] = [];
  cartelaGrid: number[][] = []; // Grid 5x5
  numerosSorteados: number[] = [];
  ultimoNumero: number = 0;
  mensagem = '';
  alunos: string[] = [];
  jogoEncerrado: boolean = false;
  quantidadeAlunosBingo: number = 0;
  intervaloAtualizacao: any;

  // Mapeamento de animais por intervalo
  animaisTema = {
    '1-10': '🐕',      // Cachorro
    '11-20': '🐈',     // Gato
    '21-30': '🦆',     // Pato
    '31-40': '🐄',     // Vaca
    '41-50': '🐷',     // Porco
    '51-60': '🦊',     // Raposa
    '61-70': '🐯',     // Tigre
    '71-80': '🦁',     // Leão
    '81-90': '🐘',     // Elefante
    '91-100': '🦒'     // Girafa
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bingoService: BingoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'];
      this.codigoSala = params['codigo'];
      this.nomeUsuario = params['nome'] || localStorage.getItem('professorNome') || '';

      if (this.tipo === 'aluno') {
        const cartelaSalva = localStorage.getItem('cartela');
        if (cartelaSalva) {
          this.cartela = JSON.parse(cartelaSalva);
          this.organizarCartelaEmGrid();
        }
      }

      this.atualizarSala();
      this.iniciarAtualizacaoAutomatica();
    });
  }

  organizarCartelaEmGrid() {
    // Organiza os 25 números em um grid 5x5
    this.cartelaGrid = [];
    for (let i = 0; i < 5; i++) {
      this.cartelaGrid[i] = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        this.cartelaGrid[i][j] = this.cartela[index] || 0;
      }
    }
  }

  obterAnimal(numero: number): string {
    if (numero === 0) return '';
    const intervalo = Math.floor((numero - 1) / 10) * 10 + 1;
    const max = intervalo + 9;
    const chave = `${intervalo}-${max}`;
    return (this.animaisTema as any)[chave] || '❓';
  }

  ngOnDestroy() {
    if (this.intervaloAtualizacao) {
      clearInterval(this.intervaloAtualizacao);
    }
  }

  iniciarAtualizacaoAutomatica() {
    this.intervaloAtualizacao = setInterval(() => {
      this.atualizarSala();
    }, 2000); // Atualiza a cada 2 segundos
  }

  atualizarSala() {
    this.bingoService.obterSala(this.codigoSala).subscribe({
      next: (response: any) => {
        this.numerosSorteados = response.sorteados || [];
        this.ultimoNumero = response.ultimoNumero || 0;
        this.alunos = Array.from(response.alunos || []);
        this.mensagem = response.mensagem || '';
        this.jogoEncerrado = response.jogoEncerrado || false;
        this.quantidadeAlunosBingo = response.quantidadeAlunosBingo || 0;
      },
      error: (error) => {
        console.error('Erro ao atualizar sala:', error);
      }
    });
  }

  sortearNumero() {
    if (this.tipo !== 'professor') return;

    this.bingoService.sortearNumero(this.codigoSala).subscribe({
      next: (response: any) => {
        this.ultimoNumero = response.numero;
        this.numerosSorteados = response.numerosSorteados;
        this.mensagem = `Número sorteado: ${this.ultimoNumero}`;
      },
      error: (error) => {
        this.mensagem = 'Erro ao sortear número: ' + error.message;
      }
    });
  }

  marcarNumero(numero: number) {
    if (this.tipo !== 'aluno') return;

    // Impede desmarcar números já sorteados
    if (this.numeroEstaSorteado(numero)) {
      this.mensagem = 'Este número já foi sorteado e não pode ser desmarcado!';
      return;
    }

    // Impede marcar números se o jogo foi encerrado
    if (this.jogoEncerrado) {
      this.mensagem = 'O jogo foi encerrado!';
      return;
    }

    this.bingoService.marcarNumero(this.codigoSala, this.nomeUsuario, numero).subscribe({
      next: (response: any) => {
        // Atualizar visual da cartela se necessário
        this.mensagem = response.mensagem || 'Número marcado!';
      },
      error: (error) => {
        this.mensagem = 'Erro ao marcar número: ' + error.message;
      }
    });
  }

  verificarBingo() {
    if (this.tipo !== 'aluno') return;

    if (this.jogoEncerrado) {
      this.mensagem = 'O jogo foi encerrado!';
      return;
    }

    this.bingoService.verificarBingo(this.codigoSala, this.nomeUsuario).subscribe({
      next: (response: any) => {
        if (response.bingo) {
          this.mensagem = '🎉 BINGO! Você ganhou! 🎉';
          alert('Parabéns! Você fez BINGO!');
        } else {
          this.mensagem = 'Ainda não fez bingo. Continue jogando!';
        }
      },
      error: (error) => {
        this.mensagem = 'Erro ao verificar bingo: ' + error.message;
      }
    });
  }

  resetarSala() {
    if (this.tipo !== 'professor') return;

    this.bingoService.resetarSala(this.codigoSala).subscribe({
      next: (response: any) => {
        this.numerosSorteados = [];
        this.ultimoNumero = 0;
        this.mensagem = 'Sala resetada! Novo jogo iniciado.';
      },
      error: (error) => {
        this.mensagem = 'Erro ao resetar sala: ' + error.message;
      }
    });
  }

  encerrarSala() {
    if (this.tipo !== 'professor') return;

    if (confirm('Tem certeza que deseja encerrar a sala?')) {
      this.bingoService.encerrarSala(this.codigoSala).subscribe({
        next: (response: any) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.mensagem = 'Erro ao encerrar sala: ' + error.message;
        }
      });
    }
  }

  numeroEstaSorteado(numero: number): boolean {
    return this.numerosSorteados.includes(numero);
  }

  voltarInicio() {
    this.router.navigate(['/']);
  }
}
