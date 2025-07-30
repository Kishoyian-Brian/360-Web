import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalLog } from './paypal-log';

describe('PaypalLog', () => {
  let component: PaypalLog;
  let fixture: ComponentFixture<PaypalLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaypalLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaypalLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
