import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno',
  imports: [RouterLink, CommonModule],
  templateUrl: './aluno.html',
  styleUrl: './aluno.scss',
})
export class AlunoComponent {
  games: any[] = [];
  imageMap: { [key: number]: string } = {};
}
