import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatematicaAluno } from './matematica-aluno';

describe('MatematicaAluno', () => {
  let component: MatematicaAluno;
  let fixture: ComponentFixture<MatematicaAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatematicaAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(MatematicaAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
