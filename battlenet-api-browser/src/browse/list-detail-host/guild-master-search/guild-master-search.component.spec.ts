import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildMasterSearchComponent } from './guild-master-search.component';

describe('GuildMasterSearchComponent', () => {
  let component: GuildMasterSearchComponent;
  let fixture: ComponentFixture<GuildMasterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildMasterSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuildMasterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
