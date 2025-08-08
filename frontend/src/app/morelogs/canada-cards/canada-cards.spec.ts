import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadaCards } from './canada-cards';

describe('CanadaCards', () => {
  let component: CanadaCards;
  let fixture: ComponentFixture<CanadaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanadaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanadaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
