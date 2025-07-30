import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankLogs } from './bank-logs';

describe('BankLogs', () => {
  let component: BankLogs;
  let fixture: ComponentFixture<BankLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
