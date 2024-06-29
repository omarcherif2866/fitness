import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationCoachComponent } from './planification-coach.component';

describe('PlanificationCoachComponent', () => {
  let component: PlanificationCoachComponent;
  let fixture: ComponentFixture<PlanificationCoachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanificationCoachComponent]
    });
    fixture = TestBed.createComponent(PlanificationCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
