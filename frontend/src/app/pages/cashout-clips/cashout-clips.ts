import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService, Video } from '../../service/video/video.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cashout-clips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashout-clips.html',
  styleUrl: './cashout-clips.css'
})
export class CashoutClips implements OnInit {
  videos: Video[] = [];
  loading = false;
  error = false;
  playingVideos: Set<string> = new Set(); // Track which videos are playing
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private videoService: VideoService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;
    this.error = false;

    this.videoService.getActiveVideos().subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.loading = false;
        console.log('Loaded videos:', this.videos);
        
        // Ensure videos load their first frame after a short delay
        setTimeout(() => {
          this.videos.forEach(video => {
            if (!this.isYouTubeUrl(video.videoUrl)) {
              const videoElements = document.querySelectorAll('video');
              videoElements.forEach(videoElement => {
                if (videoElement.src === video.videoUrl) {
                  // Set to first frame and pause
                  videoElement.currentTime = 0;
                  videoElement.pause();
                  console.log('Set video to first frame:', video.title);
                }
              });
            }
          });
        }, 500);
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.error = true;
        this.loading = false;
        this.toastService.error('Failed to load videos');
      }
    });
  }

  playVideo(video: Video, event: Event) {
    console.log('Playing video:', video);
    
    // Skip for YouTube videos (they handle their own playback)
    if (this.isYouTubeUrl(video.videoUrl)) {
      return;
    }
    
    // Get the clicked video element
    const videoElement = event.target as HTMLVideoElement;
    
    // If video is paused, start playing
    if (videoElement.paused) {
      videoElement.play().then(() => {
        console.log('Video started playing');
        this.playingVideos.add(video.id);
      }).catch(error => {
        console.error('Error playing video:', error);
      });
      
      // Increment view count when video starts playing
      this.videoService.incrementViews(video.id).subscribe({
        next: () => {
          video.views++;
          console.log('View count incremented');
        },
        error: (error) => {
          console.error('Error incrementing view count:', error);
        }
      });
    } else {
      // If video is playing, pause it and show first frame
      videoElement.pause();
      videoElement.currentTime = 0;
      this.playingVideos.delete(video.id);
    }
  }

  // Ensure video content is visible
  ensureVideoVisible(videoElement: HTMLVideoElement) {
    // Set to first frame to show video content
    videoElement.currentTime = 0;
    videoElement.pause();
    
    // Force a reload to ensure the frame is displayed
    videoElement.load();
  }

  // Handle video loaded event
  onVideoLoaded(event: Event, video: Video) {
    const videoElement = event.target as HTMLVideoElement;
    
    // Set the video to the first frame (0 seconds) to show content
    videoElement.currentTime = 0;
    
    // Ensure the video is paused and shows the first frame
    videoElement.pause();
    
    console.log('Video loaded:', video.title);
  }

  // Check if URL is a YouTube URL
  isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  // Convert YouTube URL to embed URL
  getYouTubeEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    
    let videoId = '';
    
    // Extract video ID from various YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
      // Remove any additional parameters
      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      // Remove any additional parameters
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1];
      // Remove any additional parameters
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    // Return sanitized embed URL without autoplay to start paused
    const embedUrl = `https://www.youtube.com/embed/${videoId}?mute=1&loop=1&playlist=${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Get video poster/thumbnail
  getVideoPoster(video: Video): string {
    // If video has a thumbnail, use it
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    
    // For YouTube videos, generate thumbnail URL
    if (this.isYouTubeUrl(video.videoUrl)) {
      const videoId = this.extractYouTubeVideoId(video.videoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    // Default placeholder
    return 'https://via.placeholder.com/400x300/cccccc/666666?text=Click+to+Play';
  }

  // Extract YouTube video ID
  extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1];
      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    return videoId || null;
  }

  getVideoDuration(video: Video): string {
    if (!video.duration) return 'Unknown';
    const minutes = Math.floor(video.duration / 60);
    const seconds = video.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }

  // Check if a video is currently playing
  isVideoPlaying(videoId: string): boolean {
    return this.playingVideos.has(videoId);
  }
}
