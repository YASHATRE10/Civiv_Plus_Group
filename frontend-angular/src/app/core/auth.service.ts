import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);

  constructor(private readonly http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.user.set(null);
      }
    }
    this.loading.set(false);
  }

  async login(payload: { email: string; password: string }): Promise<User> {
    const data = await firstValueFrom(this.http.post<any>('/api/auth/login', payload));
    const token = data?.token ?? '';
    const userPayload = data?.user ?? data;
    const normalizedRole = String(userPayload?.role ?? '').replace('ROLE_', '') as User['role'];

    const user: User = {
      id: Number(userPayload?.id),
      name: String(userPayload?.name ?? ''),
      email: String(userPayload?.email ?? ''),
      phone: userPayload?.phone ? String(userPayload.phone) : undefined,
      role: normalizedRole || 'CITIZEN'
    };

    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
    return user;
  }

  async register(payload: unknown): Promise<unknown> {
    return firstValueFrom(this.http.post('/api/auth/register', payload));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }
}
