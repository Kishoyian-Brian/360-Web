import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutClips } from './cashout-clips';

describe('CashoutClips', () => {
  let component: CashoutClips;
  let fixture: ComponentFixture<CashoutClips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashoutClips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashoutClips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
