import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStaticPageDto } from './create-static-page.dto';

export class UpdateStaticPageDto extends PartialType(CreateStaticPageDto) {} 