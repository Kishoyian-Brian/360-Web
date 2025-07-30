import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardedProducts } from './carded-products';

describe('CardedProducts', () => {
  let component: CardedProducts;
  let fixture: ComponentFixture<CardedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardedProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
