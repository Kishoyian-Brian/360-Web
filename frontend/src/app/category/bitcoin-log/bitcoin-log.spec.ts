import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinLog } from './bitcoin-log';

describe('BitcoinLog', () => {
  let component: BitcoinLog;
  let fixture: ComponentFixture<BitcoinLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitcoinLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
