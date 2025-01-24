import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractBrowseDetailComponent } from './abstract-browse-detail.component';

describe('AbstractBrowseDetailComponent', () => {
  let component: AbstractBrowseDetailComponent;
  let fixture: ComponentFixture<AbstractBrowseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractBrowseDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractBrowseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
