import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JogoImagemService } from '../../services/jogo-imagem.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-aluno-imagem',
  templateUrl: './aluno-imagem.html',
  styleUrls: ['./aluno-imagem.scss']
})
export class AlunoImagemComponent implements OnInit {

  salas: any[] = [];
  carregando = true;

  constructor(
    private service: JogoImagemService,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 adicione
  ) {}

  async ngOnInit() {
    try {
      this.salas = await this.service.listarSalas();
    } catch (e) {
      console.error('Erro ao carregar salas:', e);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges(); // 🔥 força atualização da tela
    }
  }

  entrar(id: number) {
    this.router.navigate(['/jogo-imagem', id]);
  }

  voltar() {
    this.router.navigate(['/aluno-dashboard']);
  }
}
