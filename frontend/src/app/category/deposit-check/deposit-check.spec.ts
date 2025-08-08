import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositCheck } from './deposit-check';

describe('DepositCheck', () => {
  let component: DepositCheck;
  let fixture: ComponentFixture<DepositCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositCheck]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositCheck);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
