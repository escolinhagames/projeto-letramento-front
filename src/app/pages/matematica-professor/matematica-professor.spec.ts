import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatematicaProfessor } from './matematica-professor';

describe('MatematicaProfessor', () => {
  let component: MatematicaProfessor;
  let fixture: ComponentFixture<MatematicaProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatematicaProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(MatematicaProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
