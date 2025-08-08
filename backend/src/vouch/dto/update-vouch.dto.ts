import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateVouchDto } from './create-vouch.dto';

export class UpdateVouchDto extends PartialType(CreateVouchDto) {}
