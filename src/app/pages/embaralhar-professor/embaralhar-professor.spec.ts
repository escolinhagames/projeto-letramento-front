import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbaralharProfessor } from './embaralhar-professor';

describe('EmbaralharProfessor', () => {
  let component: EmbaralharProfessor;
  let fixture: ComponentFixture<EmbaralharProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbaralharProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbaralharProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
