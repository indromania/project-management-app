import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Form submitted');

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      console.log('Attempting login with:', username, password);

      this.auth.login(username!, password!).subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          this.auth.saveToken(res.token);
          alert('Login successful!');

          // ✅ Route based on username
          if (username === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid username or password!');
        }
      });
    } else {
      console.warn('Form invalid');
    }
  }

  useDemo(role: string) {
    const users: Record<string, { username: string, password: string }> = {
      pm: { username: 'pm@example.com', password: 'pm123' },
      frontend: { username: 'frontend@example.com', password: 'fe123' },
      backend: { username: 'backend@example.com', password: 'be123' },
      admin: { username: 'admin', password: 'admin@123' } // ✅ updated admin demo login
    };

    const demo = users[role];
    if (demo) {
      this.loginForm.setValue({ username: demo.username, password: demo.password });
    }
  }
}
