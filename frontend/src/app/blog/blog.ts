import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService, BlogPost } from '../service/blog/blog.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-blog',
  imports: [RouterModule, CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  articles: BlogPost[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;
  total = 0;

  constructor(
    private router: Router,
    private blogService: BlogService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.loading = true;

    this.blogService.getBlogPosts({
      page: this.currentPage,
      limit: this.itemsPerPage
    }).subscribe({
      next: (response) => {
        this.articles = response.posts;
        this.total = response.total;
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.loading = false;
        console.log('Loaded blog articles from backend:', response.posts);
        console.log('Total articles:', response.total);
      },
      error: (error) => {
        console.error('Error loading blog articles:', error);
        this.toastService.error('Failed to load blog articles');
        this.loading = false;
      }
    });
  }

  // Navigate to specific page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadArticles();
    }
  }

  // Navigate to previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  // Navigate to next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  // Get page numbers for pagination
  get pageNumbers() {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // View article details
  viewArticle(article: BlogPost) {
    console.log('Viewing article:', article);
    // Navigate to article details page using slug
    this.router.navigate(['/blog', article.slug]);
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  // Get featured image or fallback
  getArticleImage(article: BlogPost): string {
    return article.featuredImage || 'https://via.placeholder.com/400x250/cccccc/666666?text=No+Image';
  }

  // Get article alt text
  getArticleAltText(article: BlogPost): string {
    return article.title || 'Blog post image';
  }

  // Get read time (estimated)
  getReadTime(article: BlogPost): string {
    const wordsPerMinute = 200;
    const wordCount = article.content?.split(' ').length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }
}
