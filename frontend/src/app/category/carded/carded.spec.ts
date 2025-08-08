import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carded } from './carded';

describe('Carded', () => {
  let component: Carded;
  let fixture: ComponentFixture<Carded>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carded]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carded);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
