// In your root module
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true, // This makes it available everywhere
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
