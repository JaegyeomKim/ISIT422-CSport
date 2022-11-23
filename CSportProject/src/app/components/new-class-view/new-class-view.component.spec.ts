import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClassViewComponent } from './new-class-view.component';

describe('NewClassViewComponent', () => {
  let component: NewClassViewComponent;
  let fixture: ComponentFixture<NewClassViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewClassViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewClassViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
