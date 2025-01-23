import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoulbindsComponent } from './soulbinds.component';

describe('SoulbindsComponent', () => {
  let component: SoulbindsComponent;
  let fixture: ComponentFixture<SoulbindsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoulbindsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoulbindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
