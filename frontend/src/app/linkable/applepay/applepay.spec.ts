import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Applepay } from './applepay';

describe('Applepay', () => {
  let component: Applepay;
  let fixture: ComponentFixture<Applepay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Applepay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Applepay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
