import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterMasterSearchComponent } from './character-master-search.component';

describe('CharacterMasterSearchComponent', () => {
  let component: CharacterMasterSearchComponent;
  let fixture: ComponentFixture<CharacterMasterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterMasterSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterMasterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
