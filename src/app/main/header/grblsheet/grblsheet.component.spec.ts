import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrblsheetComponent } from './grblsheet.component';

describe('GrblsheetComponent', () => {
  let component: GrblsheetComponent;
  let fixture: ComponentFixture<GrblsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrblsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrblsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
