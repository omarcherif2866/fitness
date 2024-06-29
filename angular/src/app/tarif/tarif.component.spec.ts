import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifComponent } from './tarif.component';

describe('TarifComponent', () => {
  let component: TarifComponent;
  let fixture: ComponentFixture<TarifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifComponent]
    });
    fixture = TestBed.createComponent(TarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
