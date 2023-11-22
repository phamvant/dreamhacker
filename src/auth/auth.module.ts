import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.jwtSecretKey,
      signOptions: {
        // expiresIn: '60s',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
