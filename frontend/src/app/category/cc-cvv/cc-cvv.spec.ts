import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcCvv } from './cc-cvv';

describe('CcCvv', () => {
  let component: CcCvv;
  let fixture: ComponentFixture<CcCvv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcCvv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcCvv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
