import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BlogService, BlogPost } from '../../service/blog/blog.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-blog-article',
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-article.html',
  styleUrl: './blog-article.css'
})
export class BlogArticle implements OnInit {
  article: BlogPost | null = null;
  isLoading = false;
  error = false;
  slug: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadArticle();
      }
    });
  }

  loadArticle() {
    this.isLoading = true;
    this.error = false;

    this.blogService.getBlogPostBySlug(this.slug).subscribe({
      next: (article) => {
        this.article = article;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog article:', error);
        this.toastService.error('Failed to load blog article');
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  getArticleImage(article: BlogPost): string {
    return article.featuredImage || 'assets/images/default-blog.jpg';
  }

  getArticleAltText(article: BlogPost): string {
    return article.title || 'Blog article image';
  }

  getReadTime(article: BlogPost): string {
    const wordsPerMinute = 200;
    const wordCount = article.content?.split(' ').length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack() {
    this.router.navigate(['/blog']);
  }

  shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: this.article?.title || 'Blog Article',
        url: window.location.href
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.toastService.success('Link copied to clipboard!');
      });
    }
  }
}
