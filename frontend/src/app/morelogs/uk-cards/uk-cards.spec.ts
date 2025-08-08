import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UkCards } from './uk-cards';

describe('UkCards', () => {
  let component: UkCards;
  let fixture: ComponentFixture<UkCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UkCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UkCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
