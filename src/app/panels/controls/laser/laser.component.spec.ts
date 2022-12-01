import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaserComponent } from './laser.component';

describe('LaserComponent', () => {
  let component: LaserComponent;
  let fixture: ComponentFixture<LaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
