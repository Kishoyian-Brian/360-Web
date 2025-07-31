import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsaBanks } from './usa-banks';

describe('UsaBanks', () => {
  let component: UsaBanks;
  let fixture: ComponentFixture<UsaBanks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsaBanks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsaBanks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
