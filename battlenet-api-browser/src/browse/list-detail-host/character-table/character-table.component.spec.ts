import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTableComponent } from './character-table.component';

describe('CharacterTableComponent', () => {
  let component: CharacterTableComponent;
  let fixture: ComponentFixture<CharacterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
