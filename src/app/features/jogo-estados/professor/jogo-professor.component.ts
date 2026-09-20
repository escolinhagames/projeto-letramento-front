import { Component, OnInit, inject, signal } from '@angular/core';
import { MapaBrasilComponent } from '../mapa-brasil/mapa-brasil.component';
import { JogoEstadosService } from '../services/jogo-estados.service';

/**
 * Tela do professor: mesmo mapa da tela do aluno, mas sem responder por clique.
 * O botão "Mudar estado" sorteia um novo estado no backend; a tela do aluno
 * recebe a mudança automaticamente (ver JogoEstadosService).
 */
@Component({
  selector: 'app-jogo-professor',
  standalone: true,
  imports: [MapaBrasilComponent],
  templateUrl: './jogo-professor.component.html',
  styleUrl: './jogo-professor.component.scss'
})
export class JogoProfessorComponent implements OnInit {
  private readonly jogoService = inject(JogoEstadosService);

  readonly estadoAtual = this.jogoService.estadoAtual;
  readonly trocando = signal(false);

  ngOnInit(): void {
    this.jogoService.iniciarSincronizacao();
  }

  mudarEstado(): void {
    if (this.trocando()) {
      return;
    }
    this.trocando.set(true);
    this.jogoService.mudarEstado().subscribe({
      complete: () => this.trocando.set(false),
      error: () => this.trocando.set(false)
    });
  }
}
