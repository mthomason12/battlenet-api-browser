import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMasterComponent } from './generic-master.component';

describe('GenericMasterComponent', () => {
  let component: GenericMasterComponent;
  let fixture: ComponentFixture<GenericMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
