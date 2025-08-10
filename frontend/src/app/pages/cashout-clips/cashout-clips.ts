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
        
        // Log video URLs for debugging
        this.videos.forEach(video => {
          console.log(`Video: ${video.title}, URL: ${video.videoUrl}, Type: ${this.isYouTubeUrl(video.videoUrl) ? 'YouTube' : 'Direct'}`);
        });
        
        // Ensure videos load their first frame after a short delay
        setTimeout(() => {
          this.videos.forEach(video => {
            if (!this.isYouTubeUrl(video.videoUrl)) {
              const videoElements = document.querySelectorAll('video');
              videoElements.forEach(videoElement => {
                if (videoElement.src === video.videoUrl) {
                  try {
                    // Set to first frame and pause
                    videoElement.currentTime = 0;
                    this.safePauseVideo(videoElement);
                    console.log('Set video to first frame:', video.title);
                  } catch (error) {
                    console.error('Error setting video to first frame:', error);
                  }
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
    
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Get the clicked video element - handle both direct video clicks and button clicks
    let videoElement: HTMLVideoElement | null = null;
    
    if (event.target instanceof HTMLVideoElement) {
      videoElement = event.target as HTMLVideoElement;
    } else if (event.target instanceof HTMLButtonElement) {
      // If button was clicked, find the associated video element
      const button = event.target as HTMLButtonElement;
      const videoContainer = button.closest('.relative');
      if (videoContainer) {
        videoElement = videoContainer.querySelector('video') as HTMLVideoElement;
      }
    } else if (event.target instanceof HTMLElement) {
      // Handle clicks on SVG elements or other HTML elements
      const clickedElement = event.target as HTMLElement;
      const videoContainer = clickedElement.closest('.relative');
      if (videoContainer) {
        videoElement = videoContainer.querySelector('video') as HTMLVideoElement;
      }
    }
    
    // Check if we found a valid video element
    if (!videoElement || typeof videoElement.pause !== 'function') {
      console.error('Invalid video element or video element not found');
      console.log('Event target:', event.target);
      console.log('Video element found:', videoElement);
      return;
    }
    
    // Ensure video is loaded
    if (videoElement.readyState < 2) {
      console.log('Video not ready, waiting for load...');
      videoElement.addEventListener('canplay', () => {
        this.handleVideoPlayback(video, videoElement);
      }, { once: true });
      return;
    }
    
    this.handleVideoPlayback(video, videoElement);
  }

  private handleVideoPlayback(video: Video, videoElement: HTMLVideoElement) {
    // If video is paused, start playing
    if (videoElement.paused) {
      this.safePlayVideo(videoElement).then((success) => {
        if (success) {
          console.log('Video started playing');
          this.playingVideos.add(video.id);
          
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
          console.error('Failed to play video');
          this.toastService.error('Failed to play video. Please try again.');
        }
      });
    } else {
      // If video is playing, pause it and show first frame
      if (this.safePauseVideo(videoElement)) {
        videoElement.currentTime = 0;
        this.playingVideos.delete(video.id);
      }
    }
  }

  // Ensure video content is visible
  ensureVideoVisible(videoElement: HTMLVideoElement) {
    try {
      // Set to first frame to show video content
      videoElement.currentTime = 0;
      this.safePauseVideo(videoElement);
      
      // Force a reload to ensure the frame is displayed
      videoElement.load();
    } catch (error) {
      console.error('Error ensuring video visibility:', error);
    }
  }

  // Handle video loaded event
  onVideoLoaded(event: Event, video: Video) {
    try {
      const videoElement = event.target as HTMLVideoElement;
      
      // Check if it's a valid video element
      if (!videoElement || typeof videoElement.pause !== 'function') {
        console.error('Invalid video element in onVideoLoaded');
        return;
      }
      
      // Set the video to the first frame (0 seconds) to show content
      videoElement.currentTime = 0;
      
      // Ensure the video is paused and shows the first frame
      this.safePauseVideo(videoElement);
      
      console.log('Video loaded:', video.title);
    } catch (error) {
      console.error('Error in onVideoLoaded:', error);
    }
  }

  // Handle video can play event
  onVideoCanPlay(event: Event, video: Video) {
    try {
      const videoElement = event.target as HTMLVideoElement;
      console.log('Video can play:', video.title, 'Ready state:', videoElement.readyState);
    } catch (error) {
      console.error('Error in onVideoCanPlay:', error);
    }
  }

  // Handle video error event
  onVideoError(event: Event, video: Video) {
    try {
      const videoElement = event.target as HTMLVideoElement;
      console.error('Video error:', video.title, 'Error:', videoElement.error);
      this.toastService.error(`Failed to load video: ${video.title}`);
    } catch (error) {
      console.error('Error in onVideoError:', error);
    }
  }

  // Check if URL is a YouTube URL
  isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  // Validate video URL
  isValidVideoUrl(url: string): boolean {
    if (!url) return false;
    
    // Check if it's a YouTube URL
    if (this.isYouTubeUrl(url)) {
      return true;
    }
    
    // Check if it's a valid video file URL
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    
    // Check if it's a valid URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

  // Helper method to safely pause a video element
  private safePauseVideo(videoElement: HTMLVideoElement): boolean {
    try {
      if (videoElement && typeof videoElement.pause === 'function') {
        videoElement.pause();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error pausing video:', error);
      return false;
    }
  }

  // Helper method to safely play a video element
  private safePlayVideo(videoElement: HTMLVideoElement): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (videoElement && typeof videoElement.play === 'function') {
          // Ensure video is muted to comply with autoplay policies
          videoElement.muted = true;
          
          // Try to play the video
          const playPromise = videoElement.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Video play successful');
              resolve(true);
            }).catch((error) => {
              console.error('Error playing video:', error);
              
              // Handle specific autoplay policy errors
              if (error.name === 'NotAllowedError') {
                console.log('Autoplay blocked by browser policy');
                this.toastService.error('Please click the play button to start the video');
              }
              
              resolve(false);
            });
          } else {
            console.log('Video play promise undefined');
            resolve(false);
          }
        } else {
          console.error('Video element or play function not available');
          resolve(false);
        }
      } catch (error) {
        console.error('Error in safePlayVideo:', error);
        resolve(false);
      }
    });
  }
}
