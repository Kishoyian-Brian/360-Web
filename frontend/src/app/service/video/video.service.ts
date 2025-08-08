import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  platform?: string;
  productId?: string;
  isActive: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoResponse {
  videos: Video[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api/videos';

  constructor(private http: HttpClient) {}

  getVideos(filters?: any): Observable<VideoResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<VideoResponse>(this.apiUrl, { params });
  }

  getVideo(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`);
  }

  getVideosByCategory(category: string): Observable<VideoResponse> {
    return this.getVideos({ category });
  }

  getActiveVideos(): Observable<VideoResponse> {
    return this.getVideos({ isActive: true });
  }

  incrementViews(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/views`, {});
  }
} 