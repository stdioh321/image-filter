import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureFiltersComponent } from './picture-filters.component';

describe('PictureFiltersComponent', () => {
  let component: PictureFiltersComponent;
  let fixture: ComponentFixture<PictureFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
