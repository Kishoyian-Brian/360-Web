import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadaBanks } from './canada-banks';

describe('CanadaBanks', () => {
  let component: CanadaBanks;
  let fixture: ComponentFixture<CanadaBanks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanadaBanks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanadaBanks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
