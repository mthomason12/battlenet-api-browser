import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachedImageComponent } from './cached-image.component';

describe('CachedImageComponent', () => {
  let component: CachedImageComponent;
  let fixture: ComponentFixture<CachedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CachedImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CachedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
