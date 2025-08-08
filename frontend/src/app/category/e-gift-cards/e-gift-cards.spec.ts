import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EGiftCards } from './e-gift-cards';

describe('EGiftCards', () => {
  let component: EGiftCards;
  let fixture: ComponentFixture<EGiftCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EGiftCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EGiftCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
