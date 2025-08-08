import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clips } from './clips';

describe('Clips', () => {
  let component: Clips;
  let fixture: ComponentFixture<Clips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
