import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedRealmComponent } from './connected-realm.component';

describe('ConnectedRealmComponent', () => {
  let component: ConnectedRealmComponent;
  let fixture: ComponentFixture<ConnectedRealmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedRealmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedRealmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
