import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealmComponent } from './realm.component';

describe('RealmComponent', () => {
  let component: RealmComponent;
  let fixture: ComponentFixture<RealmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
