import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsSupportComponent } from './credits-support.component';

describe('CreditsSupportComponent', () => {
  let component: CreditsSupportComponent;
  let fixture: ComponentFixture<CreditsSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditsSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
