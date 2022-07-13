import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviCreditsComponent } from './suivi-credits.component';

describe('SuiviCreditsComponent', () => {
  let component: SuiviCreditsComponent;
  let fixture: ComponentFixture<SuiviCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
