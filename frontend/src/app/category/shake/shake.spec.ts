import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shake } from './shake';

describe('Shake', () => {
  let component: Shake;
  let fixture: ComponentFixture<Shake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shake]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shake);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
