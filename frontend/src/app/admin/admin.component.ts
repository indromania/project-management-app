import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  engineerForm: FormGroup;
  roles: string[] = ['frontend', 'backend'];
  activeTab = 'add';
  newRole: string = '';
  teamList: any[] = [];
  filterName: string = '';
  filterRole: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.engineerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  get filteredList(): any[] {
    return this.teamList.filter(member =>
      (!this.filterName || member.name.toLowerCase().includes(this.filterName.toLowerCase())) &&
      (!this.filterRole || member.stack.toLowerCase() === this.filterRole.toLowerCase())
    );
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

    const token = this.auth.getToken();
    if (!token) {
      alert('You must be logged in to add an engineer.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://127.0.0.1:8000/api/add-engineer/', this.engineerForm.value, { headers }).subscribe({
      next: () => {
        alert('Engineer created successfully!');
        this.engineerForm.reset();
        this.fetchTeam();
      },
      error: (err) => {
        alert('Error adding engineer.');
        console.error('Add Error:', err);
      }
    });
  }

  fetchTeam() {
    const token = this.auth.getToken();
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any[]>('http://127.0.0.1:8000/api/team/', { headers }).subscribe({
      next: (data) => {
        this.teamList = data;
      },
      error: (err) => {
        console.error('Fetch Team Error:', err);
      }
    });
  }

  deleteEngineer(email: string) {
    const token = this.auth.getToken();
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(`http://127.0.0.1:8000/api/delete-engineer/?email=${encodeURIComponent(email)}`, { headers }).subscribe({
      next: () => {
        alert('Engineer deleted successfully!');
        this.fetchTeam();
      },
      error: (err) => {
        console.error('Delete error:', err);
      }
    });
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    if (tab === 'team') {
      this.fetchTeam();
    }
  }
}