import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AustraliaCards } from './australia-cards';

describe('AustraliaCards', () => {
  let component: AustraliaCards;
  let fixture: ComponentFixture<AustraliaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AustraliaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AustraliaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
