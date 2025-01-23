import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureFamilyComponent } from './creature-family.component';

describe('CreatureFamilyComponent', () => {
  let component: CreatureFamilyComponent;
  let fixture: ComponentFixture<CreatureFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureFamilyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatureFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
