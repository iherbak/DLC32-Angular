import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XyComponent } from './xy.component';

describe('XyComponent', () => {
  let component: XyComponent;
  let fixture: ComponentFixture<XyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
