import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Googlepay } from './googlepay';

describe('Googlepay', () => {
  let component: Googlepay;
  let fixture: ComponentFixture<Googlepay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Googlepay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Googlepay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
