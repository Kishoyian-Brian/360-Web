import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudCards } from './fraud-cards';

describe('FraudCards', () => {
  let component: FraudCards;
  let fixture: ComponentFixture<FraudCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraudCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
