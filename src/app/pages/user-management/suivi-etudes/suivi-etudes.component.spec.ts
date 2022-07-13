import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviEtudesComponent } from './suivi-etudes.component';

describe('SuiviEtudesComponent', () => {
  let component: SuiviEtudesComponent;
  let fixture: ComponentFixture<SuiviEtudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviEtudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviEtudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
