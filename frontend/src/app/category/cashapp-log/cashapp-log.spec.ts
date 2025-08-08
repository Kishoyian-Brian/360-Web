import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashappLog } from './cashapp-log';

describe('CashappLog', () => {
  let component: CashappLog;
  let fixture: ComponentFixture<CashappLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashappLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashappLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
