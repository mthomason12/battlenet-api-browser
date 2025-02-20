import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovenantComponent } from './covenant.component';

describe('CovenantComponent', () => {
  let component: CovenantComponent;
  let fixture: ComponentFixture<CovenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
