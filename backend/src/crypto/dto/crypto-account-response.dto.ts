import { CryptoAccount } from '@prisma/client';

export class CryptoAccountResponseDto {
  id: string;
  name: string;
  symbol: string;
  address: string;
  network?: string;
  isActive: boolean;
  order: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(account: CryptoAccount) {
    this.id = account.id;
    this.name = account.name;
    this.symbol = account.symbol;
    this.address = account.address;
    this.network = account.network || undefined;
    this.isActive = account.isActive;
    this.order = account.order;
    this.description = account.description || undefined;
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
  }
}
