import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FamilyCardModule } from './modules/family-card/family-card.module';
import { CitizenModule } from './modules/citizen/citizen.module';
import { LetterModule } from './modules/letter/letter.module';
import { ComplaintModule } from './modules/complaint/complaint.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UserModule,
    FamilyCardModule,
    CitizenModule,
    LetterModule,
    ComplaintModule,
    DashboardModule,
  ],
})
export class AppModule {}