import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professor',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './professor.html',
  styleUrl: './professor.scss',
})
export class ProfessorComponent {
  novaPalavra = '';
  novaDificuldade = 'EASY';
  games: any[] = [];
  imageMap: { [key: number]: string } = {};
  sucesso: string | null = null;
  erro: string | null = null;

  criarJogo() {
    // TODO: Implementar
  }

  onFileSelected(event: any) {
    // TODO: Implementar
  }

  desativarJogo(id: number) {
    // TODO: Implementar
  }
}
