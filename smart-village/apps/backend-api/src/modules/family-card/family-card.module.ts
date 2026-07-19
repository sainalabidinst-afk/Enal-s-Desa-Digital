import { Module } from '@nestjs/common';
import { FamilyCardController } from './family-card.controller';
import { FamilyCardService } from './family-card.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FamilyCardController],
  providers: [FamilyCardService],
  exports: [FamilyCardService],
})
export class FamilyCardModule {}