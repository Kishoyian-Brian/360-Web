import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuropeCards } from './europe-cards';

describe('EuropeCards', () => {
  let component: EuropeCards;
  let fixture: ComponentFixture<EuropeCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EuropeCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuropeCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
