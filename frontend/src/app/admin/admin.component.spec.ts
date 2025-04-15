import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  engineerForm: FormGroup;
  roles: string[] = ['frontend', 'backend'];
  activeTab: string = 'add';
  newRole: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.engineerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  addRole() {
    const role = this.newRole.trim().toLowerCase();
    if (role && !this.roles.includes(role)) {
      this.roles.push(role);
      this.newRole = '';
    }
  }

  onSubmit() {
    if (this.engineerForm.invalid) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://127.0.0.1:8000/api/add-engineer/', this.engineerForm.value, { headers }).subscribe({
      next: () => {
        alert('Engineer created successfully!');
        this.engineerForm.reset();
      },
      error: (err) => {
        alert('Error adding engineer.');
        console.error('Error:', err);
      }
    });
  }
}