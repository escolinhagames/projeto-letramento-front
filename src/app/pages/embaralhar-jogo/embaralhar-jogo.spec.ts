import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbaralharJogo } from './embaralhar-jogo';

describe('EmbaralharJogo', () => {
  let component: EmbaralharJogo;
  let fixture: ComponentFixture<EmbaralharJogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbaralharJogo],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbaralharJogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
