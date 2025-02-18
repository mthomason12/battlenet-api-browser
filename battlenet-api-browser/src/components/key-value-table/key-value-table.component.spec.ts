import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValueTableComponent } from './key-value-table.component';

describe('KeyValueTableComponent', () => {
  let component: KeyValueTableComponent;
  let fixture: ComponentFixture<KeyValueTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyValueTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
