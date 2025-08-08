import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditUnions } from './credit-unions';

describe('CreditUnions', () => {
  let component: CreditUnions;
  let fixture: ComponentFixture<CreditUnions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditUnions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditUnions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
