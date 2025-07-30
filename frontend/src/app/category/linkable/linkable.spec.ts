import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Linkable } from './linkable';

describe('Linkable', () => {
  let component: Linkable;
  let fixture: ComponentFixture<Linkable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Linkable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Linkable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
