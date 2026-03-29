import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campos login e password', () => {
    expect(component.loginForm.contains('login')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('deve armazenar o token e redirecionar ao fazer login com sucesso', fakeAsync(() => {
    const mockToken = 'fake-jwt-token';
    authServiceSpy.login.and.returnValue(of({ token: mockToken }));

    component.loginForm.setValue({ login: 'admin', password: '123456' });
    component.onSubmit();
    tick();

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('deve exibir mensagem de erro em caso de falha no login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));

    component.loginForm.setValue({ login: 'admin', password: 'wrongpass' });
    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Credenciais inválidas.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
