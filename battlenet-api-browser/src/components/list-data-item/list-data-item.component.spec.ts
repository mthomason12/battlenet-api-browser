import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataItemComponent } from './list-data-item.component';

describe('ListDataItemComponent', () => {
  let component: ListDataItemComponent;
  let fixture: ComponentFixture<ListDataItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDataItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDataItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
