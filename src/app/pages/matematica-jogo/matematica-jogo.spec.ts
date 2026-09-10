import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatematicaJogo } from './matematica-jogo';

describe('MatematicaJogo', () => {
  let component: MatematicaJogo;
  let fixture: ComponentFixture<MatematicaJogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatematicaJogo],
    }).compileComponents();

    fixture = TestBed.createComponent(MatematicaJogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
