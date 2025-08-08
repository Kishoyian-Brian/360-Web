import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ConnectionTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  message: string;
  responseTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionTestService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Test backend health
  testBackendHealth(): Observable<ConnectionTestResult> {
    const startTime = Date.now();
    
    return this.http.get(`${this.API_URL}/health`).pipe(
      map(response => ({
        endpoint: 'GET /health',
        status: 'success' as const,
        message: 'Backend is healthy',
        responseTime: Date.now() - startTime
      })),
      catchError(error => of({
        endpoint: 'GET /health',
        status: 'error' as const,
        message: `Backend health check failed: ${error.message}`,
        responseTime: Date.now() - startTime
      }))
    );
  }

  // Test auth endpoints
  testAuthEndpoints(): Observable<ConnectionTestResult[]> {
    const results: ConnectionTestResult[] = [];
    
    // Test login endpoint
    this.http.post(`${this.API_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    }).pipe(
      catchError(error => of(error))
    ).subscribe(response => {
      results.push({
        endpoint: 'POST /auth/login',
        status: response.status === 401 ? 'success' : 'error',
        message: response.status === 401 ? 'Endpoint accessible (expected 401 for invalid credentials)' : 'Endpoint not accessible'
      });
    });

    return of(results);
  }

  // Test product endpoints
  testProductEndpoints(): Observable<ConnectionTestResult[]> {
    const results: ConnectionTestResult[] = [];
    
    // Test get products endpoint
    this.http.get(`${this.API_URL}/products`).pipe(
      catchError(error => of(error))
    ).subscribe(response => {
      results.push({
        endpoint: 'GET /products',
        status: response.products ? 'success' : 'error',
        message: response.products ? 'Products endpoint working' : 'Products endpoint not accessible'
      });
    });

    return of(results);
  }

  // Test category endpoints
  testCategoryEndpoints(): Observable<ConnectionTestResult[]> {
    const results: ConnectionTestResult[] = [];
    
    // Test get categories endpoint
    this.http.get(`${this.API_URL}/categories`).pipe(
      catchError(error => of(error))
    ).subscribe(response => {
      results.push({
        endpoint: 'GET /categories',
        status: response.categories ? 'success' : 'error',
        message: response.categories ? 'Categories endpoint working' : 'Categories endpoint not accessible'
      });
    });

    return of(results);
  }

  // Test specific endpoint with authentication
  testAuthenticatedEndpoint(endpoint: string, token: string): Observable<ConnectionTestResult> {
    const startTime = Date.now();
    
    return this.http.get(`${this.API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => ({
        endpoint: `GET ${endpoint}`,
        status: 'success' as const,
        message: 'Endpoint working with authentication',
        responseTime: Date.now() - startTime
      })),
      catchError(error => of({
        endpoint: `GET ${endpoint}`,
        status: 'error' as const,
        message: `Error: ${error.status} - ${error.message}`,
        responseTime: Date.now() - startTime
      }))
    );
  }

  // Simple test for all endpoints
  testAllConnections(): Observable<ConnectionTestResult[]> {
    const allResults: ConnectionTestResult[] = [];
    
    // Test basic endpoints
    const endpoints = [
      { url: '/products', method: 'GET', name: 'Products' },
      { url: '/categories', method: 'GET', name: 'Categories' },
      { url: '/auth/login', method: 'POST', name: 'Login', body: { email: 'test@test.com', password: 'test123' } },
      { url: '/auth/register', method: 'POST', name: 'Register', body: { username: 'test', email: 'test@test.com', password: 'test123' } }
    ];

    endpoints.forEach(endpoint => {
      const startTime = Date.now();
      
      if (endpoint.method === 'GET') {
        this.http.get(`${this.API_URL}${endpoint.url}`).pipe(
          catchError(error => of(error))
        ).subscribe(response => {
          allResults.push({
            endpoint: `${endpoint.method} ${endpoint.url}`,
            status: response.status === 401 || response.status === 400 ? 'success' : 'error',
            message: `${endpoint.name} endpoint accessible`,
            responseTime: Date.now() - startTime
          });
        });
      } else if (endpoint.method === 'POST') {
        this.http.post(`${this.API_URL}${endpoint.url}`, endpoint.body).pipe(
          catchError(error => of(error))
        ).subscribe(response => {
          allResults.push({
            endpoint: `${endpoint.method} ${endpoint.url}`,
            status: response.status === 401 || response.status === 400 ? 'success' : 'error',
            message: `${endpoint.name} endpoint accessible`,
            responseTime: Date.now() - startTime
          });
        });
      }
    });

    return of(allResults);
  }
} 