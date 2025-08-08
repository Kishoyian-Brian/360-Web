import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashapp } from './cashapp';

describe('Cashapp', () => {
  let component: Cashapp;
  let fixture: ComponentFixture<Cashapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
