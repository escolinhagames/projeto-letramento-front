import { Component, OnInit, inject } from '@angular/core';
import { JogoEstadosService } from '../../../service/jogo-estados.service';
import { MapaBrasilComponent } from '../mapa-brasil/mapa-brasil.component';

/**
 * Tela do professor: acompanha o estado atual do jogo e exibe o mapa.
 * A troca do estado passa a ocorrer somente quando o aluno acerta.
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
  readonly dificuldadeAtual = this.jogoService.dificuldadeAtual;

  ngOnInit(): void {
    this.jogoService.iniciarSincronizacao();
    this.jogoService.setDificuldade(this.jogoService.dificuldadeAtual());
  }

  definirDificuldade(dificuldade: 'facil' | 'dificil'): void {
    this.jogoService.setDificuldade(dificuldade);
  }
}
