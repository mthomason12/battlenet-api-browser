import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalExpansionComponent } from './journal-expansion.component';

describe('JournalExpansionComponent', () => {
  let component: JournalExpansionComponent;
  let fixture: ComponentFixture<JournalExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalExpansionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
