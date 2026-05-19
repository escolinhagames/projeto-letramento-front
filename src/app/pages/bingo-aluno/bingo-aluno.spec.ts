import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoAluno } from './bingo-aluno';

describe('BingoAluno', () => {
  let component: BingoAluno;
  let fixture: ComponentFixture<BingoAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BingoAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(BingoAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
