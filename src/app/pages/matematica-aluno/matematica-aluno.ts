import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatematicaService } from '../../services/matematica.service';

@Component({
  selector: 'app-matematica-aluno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matematica-aluno.html',
  styleUrls: ['./matematica-aluno.scss']
})
export class MatematicaAlunoComponent implements OnInit {
  salas: any[] = [];
  carregando = true;

  constructor(
    private service: MatematicaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    setTimeout(() => this.falar('Escolha uma sala para jogar matemática!'), 600);
    this.service.listarSalas().subscribe({
      next: (data) => { this.salas = data; this.carregando = false; this.cdr.detectChanges(); },
      error: () => { this.carregando = false; }
    });
  }

  nomeDificuldade(d: string): string {
    return d === 'FACIL' ? 'Fácil' : d === 'MEDIO' ? 'Médio' : 'Difícil';
  }

  falar(texto: string) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR'; msg.rate = 0.85; msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  }

  entrar(sala: any) {
    this.router.navigate(
      ['/matematica/aluno/jogo', sala.id],
      { queryParams: { maxAcertos: sala.maxAcertos, maxErros: sala.maxErros } }
    );
  }

  voltar() { this.router.navigate(['/aluno-dashboard']); }
}
