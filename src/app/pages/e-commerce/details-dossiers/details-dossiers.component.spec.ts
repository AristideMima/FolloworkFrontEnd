import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDossiersComponent } from './details-dossiers.component';

describe('DetailsDossiersComponent', () => {
  let component: DetailsDossiersComponent;
  let fixture: ComponentFixture<DetailsDossiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDossiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
