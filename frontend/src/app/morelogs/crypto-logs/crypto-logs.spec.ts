import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoLogs } from './crypto-logs';

describe('CryptoLogs', () => {
  let component: CryptoLogs;
  let fixture: ComponentFixture<CryptoLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
