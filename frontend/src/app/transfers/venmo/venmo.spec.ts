import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Venmo } from './venmo';

describe('Venmo', () => {
  let component: Venmo;
  let fixture: ComponentFixture<Venmo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Venmo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Venmo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
