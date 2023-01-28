import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowHouseholdFoodsPage } from './show-household-foods.page';

describe('ShowHouseholdFoodsPage', () => {
  let component: ShowHouseholdFoodsPage;
  let fixture: ComponentFixture<ShowHouseholdFoodsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowHouseholdFoodsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowHouseholdFoodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
