import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosheetComponent } from './infosheet.component';

describe('InfosheetComponent', () => {
  let component: InfosheetComponent;
  let fixture: ComponentFixture<InfosheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
