import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clone } from './clone';

describe('Clone', () => {
  let component: Clone;
  let fixture: ComponentFixture<Clone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
