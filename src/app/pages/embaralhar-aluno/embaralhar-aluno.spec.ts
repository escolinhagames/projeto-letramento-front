import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbaralharAluno } from './embaralhar-aluno';

describe('EmbaralharAluno', () => {
  let component: EmbaralharAluno;
  let fixture: ComponentFixture<EmbaralharAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbaralharAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbaralharAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
