import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCryptoAccountDto } from './dto/create-crypto-account.dto';
import { UpdateCryptoAccountDto } from './dto/update-crypto-account.dto';
import { CryptoAccountResponseDto } from './dto/crypto-account-response.dto';

@Injectable()
export class CryptoService {
  constructor(private prisma: PrismaService) {}

  async create(createCryptoAccountDto: CreateCryptoAccountDto): Promise<CryptoAccountResponseDto> {
    // Check if symbol already exists
    const existingAccount = await this.prisma.cryptoAccount.findUnique({
      where: { symbol: createCryptoAccountDto.symbol }
    });

    if (existingAccount) {
      throw new ConflictException(`Crypto account with symbol '${createCryptoAccountDto.symbol}' already exists`);
    }

    const cryptoAccount = await this.prisma.cryptoAccount.create({
      data: createCryptoAccountDto,
    });

    return new CryptoAccountResponseDto(cryptoAccount);
  }

  async findAll(): Promise<CryptoAccountResponseDto[]> {
    const accounts = await this.prisma.cryptoAccount.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return accounts.map(account => new CryptoAccountResponseDto(account));
  }

  async findActive(): Promise<CryptoAccountResponseDto[]> {
    const accounts = await this.prisma.cryptoAccount.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return accounts.map(account => new CryptoAccountResponseDto(account));
  }

  async findOne(id: string): Promise<CryptoAccountResponseDto> {
    const account = await this.prisma.cryptoAccount.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Crypto account with ID '${id}' not found`);
    }

    return new CryptoAccountResponseDto(account);
  }

  async update(id: string, updateCryptoAccountDto: UpdateCryptoAccountDto): Promise<CryptoAccountResponseDto> {
    // Check if account exists
    const existingAccount = await this.prisma.cryptoAccount.findUnique({
      where: { id }
    });

    if (!existingAccount) {
      throw new NotFoundException(`Crypto account with ID '${id}' not found`);
    }

    // If updating symbol, check for conflicts
    if (updateCryptoAccountDto.symbol && updateCryptoAccountDto.symbol !== existingAccount.symbol) {
      const symbolExists = await this.prisma.cryptoAccount.findUnique({
        where: { symbol: updateCryptoAccountDto.symbol }
      });

      if (symbolExists) {
        throw new ConflictException(`Crypto account with symbol '${updateCryptoAccountDto.symbol}' already exists`);
      }
    }

    const updatedAccount = await this.prisma.cryptoAccount.update({
      where: { id },
      data: updateCryptoAccountDto,
    });

    return new CryptoAccountResponseDto(updatedAccount);
  }

  async remove(id: string): Promise<void> {
    const account = await this.prisma.cryptoAccount.findUnique({
      where: { id }
    });

    if (!account) {
      throw new NotFoundException(`Crypto account with ID '${id}' not found`);
    }

    await this.prisma.cryptoAccount.delete({
      where: { id },
    });
  }

  // Seed default crypto accounts
  async seedDefaultAccounts(): Promise<void> {
    const defaultAccounts = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        address: '1AGbgzEPd14hzLoDyYoDzwEH1MP5ZekmBi',
        order: 1
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        address: 'TKieHKDKegGjW2HojHxKgsNkZAota5CuDz',
        network: 'TRC20',
        order: 2
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        address: '0x3C774Adef37D1D6ee2180D7845AE7020e5d79B29',
        order: 3
      },
      {
        name: 'Litecoin',
        symbol: 'LTC',
        address: 'LdLygre8cKg7ak1tk3LTFTkTtBbhiUiCQn',
        order: 4
      }
    ];

    for (const account of defaultAccounts) {
      const existingAccount = await this.prisma.cryptoAccount.findUnique({
        where: { symbol: account.symbol }
      });

      if (!existingAccount) {
        await this.prisma.cryptoAccount.create({
          data: account
        });
      }
    }
  }
}
