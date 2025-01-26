import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApitreeComponent } from './apitree.component';

describe('ApitreeComponent', () => {
  let component: ApitreeComponent;
  let fixture: ComponentFixture<ApitreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApitreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApitreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
