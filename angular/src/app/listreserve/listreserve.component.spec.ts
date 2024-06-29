import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListreserveComponent } from './listreserve.component';

describe('ListreserveComponent', () => {
  let component: ListreserveComponent;
  let fixture: ComponentFixture<ListreserveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListreserveComponent]
    });
    fixture = TestBed.createComponent(ListreserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
