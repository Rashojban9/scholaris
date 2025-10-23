import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityBar } from './utility-bar';

describe('UtilityBar', () => {
  let component: UtilityBar;
  let fixture: ComponentFixture<UtilityBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
