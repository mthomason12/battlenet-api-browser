import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMasterSearchComponent } from './generic-master-search.component';

describe('GenericMasterSearchComponent', () => {
  let component: GenericMasterSearchComponent;
  let fixture: ComponentFixture<GenericMasterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericMasterSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMasterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
