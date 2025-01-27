import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractDetailComponent } from './abstract-detail.component';

describe('AbstractDetailComponent', () => {
  let component: AbstractDetailComponent;
  let fixture: ComponentFixture<AbstractDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
