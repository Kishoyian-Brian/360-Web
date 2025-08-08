import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArticle } from './blog-article';

describe('BlogArticle', () => {
  let component: BlogArticle;
  let fixture: ComponentFixture<BlogArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogArticle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
