import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailHostComponent } from './list-detail-host.component';

describe('ListDetailHostComponent', () => {
  let component: ListDetailHostComponent;
  let fixture: ComponentFixture<ListDetailHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDetailHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetailHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
