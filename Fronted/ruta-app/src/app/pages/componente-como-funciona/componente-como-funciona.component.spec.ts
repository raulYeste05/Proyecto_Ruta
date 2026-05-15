import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComponenteComoFuncionaComponent } from './componente-como-funciona.component';

describe('ComponenteComoFuncionaComponent', () => {
  let component: ComponenteComoFuncionaComponent;
  let fixture: ComponentFixture<ComponenteComoFuncionaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponenteComoFuncionaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteComoFuncionaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
