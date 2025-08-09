import { PartialType } from '@nestjs/mapped-types';
import { CreateCryptoAccountDto } from './create-crypto-account.dto';

export class UpdateCryptoAccountDto extends PartialType(CreateCryptoAccountDto) {}
