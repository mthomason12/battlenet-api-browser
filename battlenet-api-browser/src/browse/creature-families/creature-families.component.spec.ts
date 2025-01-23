import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureFamiliesComponent } from './creature-families.component';

describe('CreatureFamiliesComponent', () => {
  let component: CreatureFamiliesComponent;
  let fixture: ComponentFixture<CreatureFamiliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureFamiliesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatureFamiliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
