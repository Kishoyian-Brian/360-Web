import { Module } from '@nestjs/common';
import { VouchService } from './vouch.service';
import { VouchController } from './vouch.controller';
import { VouchSeederService } from './vouch-seeder.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VouchController],
  providers: [VouchService, VouchSeederService],
  exports: [VouchService, VouchSeederService],
})
export class VouchModule {} 