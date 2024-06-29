import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincoursComponent } from './admincours.component';

describe('AdmincoursComponent', () => {
  let component: AdmincoursComponent;
  let fixture: ComponentFixture<AdmincoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmincoursComponent]
    });
    fixture = TestBed.createComponent(AdmincoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
