import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  carregando = true;
  mensagem = '';

  constructor(
    private embaralharService: EmbaralharService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.embaralharService.listarJogosAluno().subscribe({
        next: (data) => {
          this.jogos = data;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.mensagem = 'Erro ao carregar jogos';
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
    } catch (e) {
      this.carregando = false;
    }
  }

  falar(texto: string) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR'; msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  jogar(id: number) { this.router.navigate(['/embaralhar/aluno/jogo', id]); }

  voltar() { this.router.navigate(['/aluno-dashboard']); }
}
