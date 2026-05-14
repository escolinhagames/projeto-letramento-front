import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JogoImagemService } from '../../services/jogo-imagem.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-professor-imagem',
  templateUrl: './professor-imagem.html',
  styleUrls: ['./professor-imagem.scss']
})
export class ProfessorImagemComponent implements OnInit {

  // Criação
  palavraCorreta = '';
  dificuldade = 'FACIL';
  img1: File | null = null;
  img2: File | null = null;
  img3: File | null = null;
  mensagem = '';
  erro = '';

  // Lobby
  minhasSalas: any[] = [];
  carregando = true;

  // Edição
  editando: any = null;
  editPalavra = '';
  editDificuldade = '';
  editImg1: File | null = null;
  editImg2: File | null = null;
  editImg3: File | null = null;

  constructor(
    private service: JogoImagemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.carregarSalas();
  }

  async carregarSalas() {
    this.carregando = true;
    const token = localStorage.getItem('token') || '';
    const professorId = parseInt(localStorage.getItem('professorId') || '0');
    try {
      this.minhasSalas = await this.service.listarMinhasSalas(professorId, token);
    } catch (e) {
      console.error(e);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  selecionarImg(event: Event, numero: number) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      if (numero === 1) this.img1 = input.files[0];
      if (numero === 2) this.img2 = input.files[0];
      if (numero === 3) this.img3 = input.files[0];
    }
  }

  selecionarEditImg(event: Event, numero: number) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      if (numero === 1) this.editImg1 = input.files[0];
      if (numero === 2) this.editImg2 = input.files[0];
      if (numero === 3) this.editImg3 = input.files[0];
    }
  }

  async criar() {
    this.mensagem = '';
    this.erro = '';
    if (!this.palavraCorreta || !this.img1 || !this.img2 || !this.img3) {
      this.erro = 'Preencha todos os campos e selecione as 3 imagens.';
      return;
    }
    const token = localStorage.getItem('token') || '';
    const professorId = parseInt(localStorage.getItem('professorId') || '0');
    try {
      await this.service.criarSala(
        this.palavraCorreta, this.dificuldade,
        this.img1, this.img2, this.img3,
        professorId, token
      );
      this.mensagem = 'Sala criada com sucesso!';
      this.palavraCorreta = '';
      this.dificuldade = 'FACIL';
      this.img1 = null; this.img2 = null; this.img3 = null;
      await this.carregarSalas();
    } catch {
      this.erro = 'Erro ao criar sala.';
    }
  }

  abrirEdicao(sala: any) {
    this.editando = sala;
    this.editPalavra = sala.palavraCorreta;
    this.editDificuldade = sala.dificuldade;
    this.editImg1 = null; this.editImg2 = null; this.editImg3 = null;
  }

  fecharEdicao() {
    this.editando = null;
  }

  async salvarEdicao() {
    const token = localStorage.getItem('token') || '';
    try {
      await this.service.editarSala(
        this.editando.id,
        this.editPalavra, this.editDificuldade,
        this.editImg1, this.editImg2, this.editImg3,
        token
      );
      this.mensagem = 'Sala atualizada!';
      this.fecharEdicao();
      await this.carregarSalas();
    } catch {
      this.erro = 'Erro ao editar sala.';
    }
  }

  async deletar(id: number) {
    if (!confirm('Tem certeza que deseja deletar esta sala?')) return;
    const token = localStorage.getItem('token') || '';
    try {
      await this.service.deletarSala(id, token);
      await this.carregarSalas();
    } catch {
      this.erro = 'Erro ao deletar sala.';
    }
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
