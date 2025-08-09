import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateCryptoAccountDto } from './dto/create-crypto-account.dto';
import { UpdateCryptoAccountDto } from './dto/update-crypto-account.dto';
import { CryptoAccountResponseDto } from './dto/crypto-account-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createCryptoAccountDto: CreateCryptoAccountDto): Promise<CryptoAccountResponseDto> {
    return this.cryptoService.create(createCryptoAccountDto);
  }

  @Get()
  async findAll(): Promise<CryptoAccountResponseDto[]> {
    return this.cryptoService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CryptoAccountResponseDto[]> {
    return this.cryptoService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CryptoAccountResponseDto> {
    return this.cryptoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<CryptoAccountResponseDto> {
    return this.cryptoService.update(id, updateCryptoAccountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.cryptoService.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async seedDefault(): Promise<{ message: string }> {
    await this.cryptoService.seedDefaultAccounts();
    return { message: 'Default crypto accounts seeded successfully' };
  }
}
