import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Memorizacao } from './memorizacao';

describe('Memorizacao', () => {
  let component: Memorizacao;
  let fixture: ComponentFixture<Memorizacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Memorizacao],
    }).compileComponents();

    fixture = TestBed.createComponent(Memorizacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
