import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractMasterComponent } from './abstract-master.component';

describe('AbstractMasterComponent', () => {
  let component: AbstractMasterComponent;
  let fixture: ComponentFixture<AbstractMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
