import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserverterrainComponent } from './reserverterrain.component';

describe('ReserverterrainComponent', () => {
  let component: ReserverterrainComponent;
  let fixture: ComponentFixture<ReserverterrainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReserverterrainComponent]
    });
    fixture = TestBed.createComponent(ReserverterrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
