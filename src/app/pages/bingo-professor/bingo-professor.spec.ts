import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoProfessor } from './bingo-professor';

describe('BingoProfessor', () => {
  let component: BingoProfessor;
  let fixture: ComponentFixture<BingoProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BingoProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(BingoProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
