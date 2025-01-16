import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractBrowseChildComponent } from './abstract-browse-child.component';

describe('AbstractBrowseChildComponent', () => {
  let component: AbstractBrowseChildComponent;
  let fixture: ComponentFixture<AbstractBrowseChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractBrowseChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractBrowseChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
