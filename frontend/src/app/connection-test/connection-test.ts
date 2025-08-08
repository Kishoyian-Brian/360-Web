import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionTestService, ConnectionTestResult } from '../connection-test.service';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Frontend-Backend Connection Test</h1>
      
      <div class="mb-4">
        <button 
          (click)="runTests()" 
          [disabled]="isRunning"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isRunning ? 'Running Tests...' : 'Run Connection Tests' }}
        </button>
      </div>

      <div *ngIf="results.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            *ngFor="let result of results" 
            class="p-4 border rounded-lg"
            [ngClass]="{
              'border-green-200 bg-green-50': result.status === 'success',
              'border-red-200 bg-red-50': result.status === 'error',
              'border-yellow-200 bg-yellow-50': result.status === 'timeout'
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm">{{ result.endpoint }}</h3>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': result.status === 'success',
                  'bg-red-100 text-red-800': result.status === 'error',
                  'bg-yellow-100 text-yellow-800': result.status === 'timeout'
                }"
              >
                {{ result.status.toUpperCase() }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ result.message }}</p>
            <p *ngIf="result.responseTime" class="text-xs text-gray-500 mt-1">
              Response time: {{ result.responseTime }}ms
            </p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">Summary</h3>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="font-medium">Total Tests:</span> {{ results.length }}
            </div>
            <div>
              <span class="font-medium text-green-600">Success:</span> 
              {{ getSuccessCount() }}
            </div>
            <div>
              <span class="font-medium text-red-600">Failed:</span> 
              {{ getErrorCount() }}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isRunning" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Testing connections...</p>
      </div>
    </div>
  `
})
export class ConnectionTestComponent implements OnInit {
  results: ConnectionTestResult[] = [];
  isRunning = false;

  constructor(private connectionTestService: ConnectionTestService) {}

  ngOnInit() {
    // Auto-run tests on component load
    this.runTests();
  }

  runTests() {
    this.isRunning = true;
    this.results = [];

    // Test backend health first
    this.connectionTestService.testBackendHealth().subscribe(healthResult => {
      this.results.push(healthResult);
      
      // If backend is healthy, run all connection tests
      if (healthResult.status === 'success') {
        this.connectionTestService.testAllConnections().subscribe(allResults => {
          this.results = [healthResult, ...allResults];
          this.isRunning = false;
        });
      } else {
        this.isRunning = false;
      }
    });
  }

  getSuccessCount(): number {
    return this.results.filter(r => r.status === 'success').length;
  }

  getErrorCount(): number {
    return this.results.filter(r => r.status === 'error').length;
  }
} 