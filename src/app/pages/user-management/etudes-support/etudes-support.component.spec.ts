import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudesSupportComponent } from './etudes-support.component';

describe('EtudesSupportComponent', () => {
  let component: EtudesSupportComponent;
  let fixture: ComponentFixture<EtudesSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudesSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudesSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
