import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  nome = '';
  modalAberto = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.nome = localStorage.getItem('nome') || '';
  }

  falar(texto: string, event?: Event) {
    if (event) event.stopPropagation();
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
  }

  abrirModal() { this.modalAberto = true; }
  fecharModal() { this.modalAberto = false; }

  selecionarJogo(jogo: number) {
    if (jogo === 1) { this.router.navigate(['/bingo/professor']); return; }
    if (jogo === 2) { this.router.navigate(['/embaralhar/professor']); return; }
    if (jogo === 3) { this.router.navigate(['/memorizacao']); return; }
    if (jogo === 4) { this.router.navigate(['/professor-imagem']); return; }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async salvarPalavra() {
    const palavraInput = document.getElementById('palavra') as HTMLInputElement;
    const imagemInput = document.getElementById('imagem') as HTMLInputElement;
    const token = localStorage.getItem('token') || '';
    const professorId = localStorage.getItem('professorId') || '1';

    if (!palavraInput?.value || !imagemInput?.files?.length) {
      alert('Preencha tudo');
      return;
    }

    const formData = new FormData();
    formData.append('palavra', palavraInput.value);
    formData.append('imagem', imagemInput.files![0]);

    try {
      const response = await fetch(`${environment.apiUrl}/palavras/${professorId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (response.ok) { alert('Salvo com sucesso'); this.fecharModal(); }
      else alert('Erro: ' + response.status);
    } catch (e) {
      alert('Erro ao salvar palavra');
    }
  }
}
