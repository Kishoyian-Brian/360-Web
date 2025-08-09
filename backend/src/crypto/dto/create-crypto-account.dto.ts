import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateCryptoAccountDto {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
