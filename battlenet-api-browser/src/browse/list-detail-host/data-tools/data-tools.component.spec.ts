import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataToolsComponent } from './data-tools.component';

describe('DataToolsComponent', () => {
  let component: DataToolsComponent;
  let fixture: ComponentFixture<DataToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
