import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildComponent } from './guild.component';

describe('GuildComponent', () => {
  let component: GuildComponent;
  let fixture: ComponentFixture<GuildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
