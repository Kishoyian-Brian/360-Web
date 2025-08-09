import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export interface Vouch {
    id: string;
    username: string;
    avatarSeed: string;
    avatarUrl: string;
    rating: number;
    reviewText: string;
    reviewImage?: string;
    isVerified: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
    timeAgo: string;
}

export interface CreateVouchDto {
    username: string;
    avatarSeed: string;
    rating: number;
    reviewText: string;
    reviewImage?: string;
    isVerified?: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface UpdateVouchDto {
    username?: string;
    avatarSeed?: string;
    rating?: number;
    reviewText?: string;
    reviewImage?: string;
    isVerified?: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface VouchFilterDto {
    page?: number;
    limit?: number;
    username?: string;
    rating?: number;
    isVerified?: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    search?: string;
}

export interface VouchResponse {
    vouches: Vouch[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface VouchStats {
    totalVouches: number;
    approvedVouches: number;
    verifiedVouches: number;
    averageRating: number;
}

@Injectable({
    providedIn: 'root'
})
export class VouchService {
    private readonly API_URL = 'https://three60-web-gzzw.onrender.com/api/vouches';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // Public read operations (no auth required)
    getVouches(filterDto: VouchFilterDto = {}): Observable<VouchResponse> {
        let params = new HttpParams();

        if (filterDto.page) params = params.set('page', filterDto.page.toString());
        if (filterDto.limit) params = params.set('limit', filterDto.limit.toString());
        if (filterDto.username) params = params.set('username', filterDto.username);
        if (filterDto.rating) params = params.set('rating', filterDto.rating.toString());
        if (filterDto.isVerified !== undefined) params = params.set('isVerified', filterDto.isVerified.toString());
        if (filterDto.status) params = params.set('status', filterDto.status);
        if (filterDto.search) params = params.set('search', filterDto.search);

        return this.http.get<any>(this.API_URL, { params }).pipe(
            map(response => ({
                vouches: response.vouches || [],
                total: response.pagination?.total || 0,
                page: response.pagination?.page || 1,
                limit: response.pagination?.limit || 10,
                totalPages: response.pagination?.totalPages || 1
            }))
        );
    }

    // Get approved vouches for public display
    getApprovedVouches(page: number = 1, limit: number = 10): Observable<VouchResponse> {
        return this.getVouches({
            page,
            limit,
            status: 'APPROVED'
        });
    }

    // Get a specific vouch by ID
    getVouchById(id: string): Observable<Vouch> {
        return this.http.get<Vouch>(`${this.API_URL}/${id}`);
    }

    // Admin operations (auth required)
    createVouch(createVouchDto: CreateVouchDto): Observable<Vouch> {
        return this.http.post<Vouch>(this.API_URL, createVouchDto, {
            headers: this.authService.getAuthHeaders()
        });
    }

    updateVouch(id: string, updateVouchDto: UpdateVouchDto): Observable<Vouch> {
        return this.http.put<Vouch>(`${this.API_URL}/${id}`, updateVouchDto, {
            headers: this.authService.getAuthHeaders()
        });
    }

    approveVouch(id: string): Observable<Vouch> {
        return this.http.patch<Vouch>(`${this.API_URL}/${id}/approve`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    rejectVouch(id: string): Observable<Vouch> {
        return this.http.patch<Vouch>(`${this.API_URL}/${id}/reject`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    toggleVerification(id: string): Observable<Vouch> {
        return this.http.patch<Vouch>(`${this.API_URL}/${id}/toggle-verification`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    deleteVouch(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    getVouchStats(): Observable<VouchStats> {
        return this.http.get<VouchStats>(`${this.API_URL}/stats`);
    }

    seedVouches(): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/seed`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    clearVouches(): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/clear`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    getSeedStats(): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/seed/stats`);
    }

    // Helper methods
    getAvatarUrl(avatarSeed: string): string {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getRatingStars(rating: number): { filled: number; empty: number } {
        const filled = Math.floor(rating);
        const empty = 5 - filled;
        return { filled, empty };
    }
} 