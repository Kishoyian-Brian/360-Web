import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StealthAccounts } from './stealth-accounts';

describe('StealthAccounts', () => {
  let component: StealthAccounts;
  let fixture: ComponentFixture<StealthAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StealthAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StealthAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
