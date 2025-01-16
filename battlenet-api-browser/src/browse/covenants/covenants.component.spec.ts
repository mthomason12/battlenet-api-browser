import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovenantsComponent } from './covenants.component';

describe('CovenantsComponent', () => {
  let component: CovenantsComponent;
  let fixture: ComponentFixture<CovenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovenantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
