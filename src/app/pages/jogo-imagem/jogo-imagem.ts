import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JogoImagemService } from '../../services/jogo-imagem.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-jogo-imagem',
  templateUrl: './jogo-imagem.html',
  styleUrls: ['./jogo-imagem.scss']
})
export class JogoImagemComponent implements OnInit {

  sala: any = null;
  imagens: { base64: string; correta: boolean }[] = [];
  selecionada: number | null = null;
  resultado: 'acerto' | 'erro' | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: JogoImagemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      this.sala = await this.service.buscarSala(id);
      this.imagens = this.embaralhar([
        { base64: this.sala.imagem1, correta: true },
        { base64: this.sala.imagem2, correta: false },
        { base64: this.sala.imagem3, correta: false },
      ]);
    } catch (e) {
      console.error('Erro ao carregar sala:', e);
    }
    this.cdr.detectChanges();
  }

  embaralhar(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  selecionar(index: number) {
    if (this.resultado === 'acerto') return;
    this.selecionada = index;
  }

  falarLetra() {
    const dica = this.sala?.dica || '';
    this.falar(dica);
  }

  falar(texto: string) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  confirmar() {
    if (this.selecionada === null) {
      alert('Selecione uma imagem primeiro');
      return;
    }
    const correta = this.imagens[this.selecionada].correta;
    if (correta) {
      this.resultado = 'acerto';
      this.falar('Parabéns, você acertou!');
    } else {
      this.resultado = 'erro';
      this.falar('Tente novamente');
      setTimeout(() => {
        this.selecionada = null;
        this.resultado = null;
      }, 2000);
    }
  }

  voltarParaSalas() {
    this.router.navigate(['/aluno-imagem']);
  }
}
