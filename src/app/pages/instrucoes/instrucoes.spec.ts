import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instrucoes } from './instrucoes';

describe('Instrucoes', () => {
  let component: Instrucoes;
  let fixture: ComponentFixture<Instrucoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instrucoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Instrucoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
