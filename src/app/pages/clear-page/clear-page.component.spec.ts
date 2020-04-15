import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearPageComponent } from './clear-page.component';

describe('ClearPageComponent', () => {
  let component: ClearPageComponent;
  let fixture: ComponentFixture<ClearPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
