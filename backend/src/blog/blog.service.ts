import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { BlogPostResponseDto } from './dto/blog-post-response.dto';
import { BlogPost, BlogPostStatus, CommentStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Helper to map Prisma BlogPost to BlogPostResponseDto
  private mapToBlogPostResponse(post: any): BlogPostResponseDto {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      featuredImage: post.featuredImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
      viewCount: post.viewCount,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      categoryId: post.categoryId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
      } : undefined,
      category: post.category ? {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
      } : undefined,
      tags: post.tags ? post.tags.map((tag: any) => ({
        id: tag.tag.id,
        name: tag.tag.name,
        slug: tag.tag.slug,
      })) : undefined,
      commentsCount: post._count?.comments || 0,
    };
  }

  // Blog Posts CRUD
  async createBlogPost(createBlogPostDto: CreateBlogPostDto, authorId: string): Promise<BlogPostResponseDto> {
    // Check if slug already exists
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException(`Blog post with slug '${createBlogPostDto.slug}' already exists.`);
    }

    // Check if category exists if provided
    if (createBlogPostDto.categoryId) {
      const category = await this.prisma.blogCategory.findUnique({
        where: { id: createBlogPostDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Blog category with ID '${createBlogPostDto.categoryId}' not found.`);
      }
    }

    // Check if tags exist if provided
    if (createBlogPostDto.tagIds && createBlogPostDto.tagIds.length > 0) {
      const tags = await this.prisma.blogTag.findMany({
        where: { id: { in: createBlogPostDto.tagIds } },
      });
      if (tags.length !== createBlogPostDto.tagIds.length) {
        throw new NotFoundException('One or more tags not found.');
      }
    }

    const post = await this.prisma.blogPost.create({
      data: {
        title: createBlogPostDto.title,
        slug: createBlogPostDto.slug,
        content: createBlogPostDto.content,
        excerpt: createBlogPostDto.excerpt,
        status: createBlogPostDto.status,
        featuredImage: createBlogPostDto.featuredImage,
        metaTitle: createBlogPostDto.metaTitle,
        metaDescription: createBlogPostDto.metaDescription,
        keywords: createBlogPostDto.keywords,
        isFeatured: createBlogPostDto.isFeatured,
        publishedAt: createBlogPostDto.publishedAt ? new Date(createBlogPostDto.publishedAt) : null,
        authorId,
        categoryId: createBlogPostDto.categoryId,
        tags: createBlogPostDto.tagIds ? {
          create: createBlogPostDto.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } },
          })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return this.mapToBlogPostResponse(post);
  }

  async getBlogPosts(filterDto: BlogFilterDto): Promise<{ posts: BlogPostResponseDto[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      categoryId,
      categorySlug,
      tagId,
      tagSlug,
      authorId,
      isFeatured,
      year,
      month,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Category filters
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    // Tag filters
    if (tagId) {
      where.tags = { some: { tagId } };
    }

    if (tagSlug) {
      where.tags = { some: { tag: { slug: tagSlug } } };
    }

    // Author filter
    if (authorId) {
      where.authorId = authorId;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Date filters
    if (year || month) {
      where.publishedAt = {};
      if (year) {
        where.publishedAt.gte = new Date(year, 0, 1);
        where.publishedAt.lt = new Date(year + 1, 0, 1);
      }
      if (month) {
        const startDate = new Date(year || new Date().getFullYear(), month - 1, 1);
        const endDate = new Date(year || new Date().getFullYear(), month, 0);
        where.publishedAt.gte = startDate;
        where.publishedAt.lte = endDate;
      }
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      posts: posts.map(post => this.mapToBlogPostResponse(post)),
      total,
      page,
      limit,
    };
  }

  async getBlogPostById(id: string): Promise<BlogPostResponseDto> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID '${id}' not found.`);
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return this.mapToBlogPostResponse(post);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostResponseDto> {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug '${slug}' not found.`);
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return this.mapToBlogPostResponse(post);
  }

  async updateBlogPost(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPostResponseDto> {
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID '${id}' not found.`);
    }

    // Check for slug conflict if slug is being updated
    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== existingPost.slug) {
      const slugConflict = await this.prisma.blogPost.findUnique({
        where: { slug: updateBlogPostDto.slug },
      });
      if (slugConflict) {
        throw new ConflictException(`Blog post with slug '${updateBlogPostDto.slug}' already exists.`);
      }
    }

    // Check if category exists if provided
    if (updateBlogPostDto.categoryId) {
      const category = await this.prisma.blogCategory.findUnique({
        where: { id: updateBlogPostDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Blog category with ID '${updateBlogPostDto.categoryId}' not found.`);
      }
    }

    const updatedPost = await this.prisma.blogPost.update({
      where: { id },
      data: {
        title: updateBlogPostDto.title,
        slug: updateBlogPostDto.slug,
        content: updateBlogPostDto.content,
        excerpt: updateBlogPostDto.excerpt,
        status: updateBlogPostDto.status as BlogPostStatus,
        featuredImage: updateBlogPostDto.featuredImage,
        metaTitle: updateBlogPostDto.metaTitle,
        metaDescription: updateBlogPostDto.metaDescription,
        keywords: updateBlogPostDto.keywords,
        isFeatured: updateBlogPostDto.isFeatured,
        publishedAt: updateBlogPostDto.publishedAt ? new Date(updateBlogPostDto.publishedAt) : undefined,
        categoryId: updateBlogPostDto.categoryId,
        viewCount: updateBlogPostDto.viewCount,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return this.mapToBlogPostResponse(updatedPost);
  }

  async deleteBlogPost(id: string): Promise<{ message: string }> {
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID '${id}' not found.`);
    }

    await this.prisma.blogPost.delete({
      where: { id },
    });

    return { message: `Blog post '${existingPost.title}' deleted successfully.` };
  }

  // Blog Categories CRUD
  async createBlogCategory(name: string, slug: string, description?: string, parentId?: string): Promise<any> {
    const existingCategory = await this.prisma.blogCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException(`Blog category with slug '${slug}' already exists.`);
    }

    if (parentId) {
      const parentCategory = await this.prisma.blogCategory.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID '${parentId}' not found.`);
      }
    }

    return this.prisma.blogCategory.create({
      data: {
        name,
        slug,
        description,
        parentId,
      },
    });
  }

  async getBlogCategories(): Promise<any[]> {
    return this.prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  // Blog Tags CRUD
  async createBlogTag(name: string, slug: string, description?: string): Promise<any> {
    const existingTag = await this.prisma.blogTag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      throw new ConflictException(`Blog tag with slug '${slug}' already exists.`);
    }

    return this.prisma.blogTag.create({
      data: {
        name,
        slug,
        description,
      },
    });
  }

  async getBlogTags(): Promise<any[]> {
    return this.prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  // Blog Comments CRUD
  async createBlogComment(postId: string, userId: string, content: string, parentId?: string): Promise<any> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID '${postId}' not found.`);
    }

    if (parentId) {
      const parentComment = await this.prisma.blogComment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID '${parentId}' not found.`);
      }
    }

    return this.prisma.blogComment.create({
      data: {
        content,
        postId,
        userId,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getBlogComments(postId: string): Promise<any[]> {
    return this.prisma.blogComment.findMany({
      where: {
        postId,
        status: CommentStatus.APPROVED,
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        replies: {
          where: { status: CommentStatus.APPROVED },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Special queries
  async getFeaturedPosts(limit: number = 5): Promise<BlogPostResponseDto[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        isFeatured: true,
        status: BlogPostStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return posts.map(post => this.mapToBlogPostResponse(post));
  }

  async getPopularPosts(limit: number = 5): Promise<BlogPostResponseDto[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return posts.map(post => this.mapToBlogPostResponse(post));
  }
} 