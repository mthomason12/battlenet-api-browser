import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoulbindComponent } from './soulbind.component';

describe('SoulbindComponent', () => {
  let component: SoulbindComponent;
  let fixture: ComponentFixture<SoulbindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoulbindComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoulbindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
