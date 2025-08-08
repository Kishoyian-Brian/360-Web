import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogPostDto } from './create-blog-post.dto';

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {
  @ApiProperty({ description: 'Whether the post is featured', required: false })
  isFeatured?: boolean;

  @ApiProperty({ description: 'View count', required: false })
  viewCount?: number;
} 