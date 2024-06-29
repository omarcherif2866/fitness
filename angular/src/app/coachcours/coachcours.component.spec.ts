import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachcoursComponent } from './coachcours.component';

describe('CoachcoursComponent', () => {
  let component: CoachcoursComponent;
  let fixture: ComponentFixture<CoachcoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachcoursComponent]
    });
    fixture = TestBed.createComponent(CoachcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
