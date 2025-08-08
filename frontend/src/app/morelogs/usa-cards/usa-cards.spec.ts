import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsaCards } from './usa-cards';

describe('UsaCards', () => {
  let component: UsaCards;
  let fixture: ComponentFixture<UsaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
