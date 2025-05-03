import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'] 
})
export class PasswordResetRequestComponent {
  form: FormGroup;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      login: ['', Validators.required],
    });
  }

  onSubmit() {
    this.http.post('http://localhost:5063/api/v1/Auth/resetar-senha', this.form.value)
      .subscribe({
        next: () => {
          this.message = 'Se o login existir, as instruções foram enviadas.';
          this.error = '';
        },
        error: () => {
          this.error = 'Erro ao tentar solicitar recuperação. Tente novamente.';
          this.message = '';
        },
      });
  }
}
