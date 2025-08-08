import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zelle } from './zelle';

describe('Zelle', () => {
  let component: Zelle;
  let fixture: ComponentFixture<Zelle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zelle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zelle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
