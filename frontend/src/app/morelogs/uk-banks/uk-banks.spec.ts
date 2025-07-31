import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UkBanks } from './uk-banks';

describe('UkBanks', () => {
  let component: UkBanks;
  let fixture: ComponentFixture<UkBanks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UkBanks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UkBanks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
