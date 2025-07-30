import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fullz } from './fullz';

describe('Fullz', () => {
  let component: Fullz;
  let fixture: ComponentFixture<Fullz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fullz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fullz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
