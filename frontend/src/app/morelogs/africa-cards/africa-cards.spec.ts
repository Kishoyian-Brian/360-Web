import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfricaCards } from './africa-cards';

describe('AfricaCards', () => {
  let component: AfricaCards;
  let fixture: ComponentFixture<AfricaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfricaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfricaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
