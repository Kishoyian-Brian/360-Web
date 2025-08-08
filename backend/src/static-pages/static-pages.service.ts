import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { StaticPageResponseDto } from './dto/static-page-response.dto';
import { StaticPage, StaticPageStatus } from '@prisma/client';

@Injectable()
export class StaticPagesService {
  constructor(private prisma: PrismaService) {}

  // Helper to map Prisma StaticPage to StaticPageResponseDto
  private mapToStaticPageResponse(page: StaticPage): StaticPageResponseDto {
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle || undefined,
      metaDescription: page.metaDescription || undefined,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  // Create a new static page
  async createStaticPage(createStaticPageDto: CreateStaticPageDto): Promise<StaticPageResponseDto> {
    // Check if slug already exists
    const existingPage = await this.prisma.staticPage.findUnique({
      where: { slug: createStaticPageDto.slug },
    });

    if (existingPage) {
      throw new ConflictException(`Static page with slug '${createStaticPageDto.slug}' already exists.`);
    }

    const page = await this.prisma.staticPage.create({
      data: {
        title: createStaticPageDto.title,
        slug: createStaticPageDto.slug,
        content: createStaticPageDto.content,
        metaTitle: createStaticPageDto.metaTitle,
        metaDescription: createStaticPageDto.metaDescription,
        status: createStaticPageDto.status,
      },
    });

    return this.mapToStaticPageResponse(page);
  }

  // Get all static pages
  async getAllStaticPages(): Promise<StaticPageResponseDto[]> {
    const pages = await this.prisma.staticPage.findMany({
      where: { status: StaticPageStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
    });

    return pages.map(page => this.mapToStaticPageResponse(page));
  }

  // Get static page by ID
  async getStaticPageById(id: string): Promise<StaticPageResponseDto> {
    const page = await this.prisma.staticPage.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException(`Static page with ID '${id}' not found.`);
    }

    return this.mapToStaticPageResponse(page);
  }

  // Get static page by slug
  async getStaticPageBySlug(slug: string): Promise<StaticPageResponseDto> {
    const page = await this.prisma.staticPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`Static page with slug '${slug}' not found.`);
    }

    return this.mapToStaticPageResponse(page);
  }

  // Update static page
  async updateStaticPage(id: string, updateStaticPageDto: UpdateStaticPageDto): Promise<StaticPageResponseDto> {
    const existingPage = await this.prisma.staticPage.findUnique({
      where: { id },
    });

    if (!existingPage) {
      throw new NotFoundException(`Static page with ID '${id}' not found.`);
    }

    // Check for slug conflict if slug is being updated
    if (updateStaticPageDto.slug && updateStaticPageDto.slug !== existingPage.slug) {
      const slugConflict = await this.prisma.staticPage.findUnique({
        where: { slug: updateStaticPageDto.slug },
      });
      if (slugConflict) {
        throw new ConflictException(`Static page with slug '${updateStaticPageDto.slug}' already exists.`);
      }
    }

    const updatedPage = await this.prisma.staticPage.update({
      where: { id },
      data: {
        title: updateStaticPageDto.title,
        slug: updateStaticPageDto.slug,
        content: updateStaticPageDto.content,
        metaTitle: updateStaticPageDto.metaTitle,
        metaDescription: updateStaticPageDto.metaDescription,
        status: updateStaticPageDto.status,
      },
    });

    return this.mapToStaticPageResponse(updatedPage);
  }

  // Delete static page
  async deleteStaticPage(id: string): Promise<{ message: string }> {
    const existingPage = await this.prisma.staticPage.findUnique({
      where: { id },
    });

    if (!existingPage) {
      throw new NotFoundException(`Static page with ID '${id}' not found.`);
    }

    await this.prisma.staticPage.delete({
      where: { id },
    });

    return { message: `Static page '${existingPage.title}' deleted successfully.` };
  }
} 