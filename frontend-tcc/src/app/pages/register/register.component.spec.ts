import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['register']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campos obrigatórios', () => {
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('login')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('confirmPassword')).toBeTrue();
  });

  it('deve exibir mensagem de erro se o formulário for inválido', () => {
    component.registerForm.setValue({
      email: '',
      login: '',
      password: '',
      confirmPassword: ''
    });

    component.onSubmit();
    expect(component.errorMessage).toBe('Preencha todos os campos corretamente.');
  });

  it('deve exibir mensagem de erro se as senhas não coincidirem', () => {
    component.registerForm.setValue({
      email: 'teste@email.com',
      login: 'usuario',
      password: 'senha123',
      confirmPassword: 'outrasenha'
    });

    component.onSubmit();
    expect(component.errorMessage).toBe('As senhas não coincidem.');
  });

  it('deve chamar o serviço e definir a mensagem de sucesso quando o registro for bem-sucedido', () => {
    component.registerForm.setValue({
      email: 'teste@email.com',
      login: 'usuario',
      password: 'senha123',
      confirmPassword: 'senha123'
    });

    userServiceSpy.register.and.returnValue(of('Verifique seu e-mail para completar seu registro.'));

    component.onSubmit();

    expect(userServiceSpy.register).toHaveBeenCalled();
    expect(component.successMessage).toBe('Verifique seu e-mail para completar seu registro.');
    expect(component.errorMessage).toBe('');
  });

  it('deve definir mensagem de erro se o serviço retornar erro', () => {
    component.registerForm.setValue({
      email: 'teste@email.com',
      login: 'usuario',
      password: 'senha123',
      confirmPassword: 'senha123'
    });

    userServiceSpy.register.and.returnValue(throwError(() => ({
      error: 'E-mail já cadastrado.'
    })));

    component.onSubmit();

    expect(component.errorMessage).toBe('E-mail já cadastrado.');
    expect(component.successMessage).toBeNull();
  });
});
