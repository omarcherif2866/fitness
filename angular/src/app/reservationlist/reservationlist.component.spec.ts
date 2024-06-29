import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListComponent } from './reservationlist.component';

describe('ReservationlistComponent', () => {
  let component: ReservationListComponent;
  let fixture: ComponentFixture<ReservationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationListComponent]
    });
    fixture = TestBed.createComponent(ReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
