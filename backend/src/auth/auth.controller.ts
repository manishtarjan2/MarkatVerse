import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: any) {
    return this.authService.signup(data);
  }

  @Post('login')
  login(@Body() data: any) {
    return this.authService.login(data);
  }

  @Post('phone-login')
  phoneLogin(@Body() data: any) {
    return this.authService.phoneLogin(data.phone);
  }

  @Get('me')
  getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.authService.getMe(token);
  }

  @Post('forgot-password')
  forgotPassword(@Body('identifier') identifier: string) {
    return this.authService.forgotPassword(identifier);
  }

  @Post('reset-password')
  resetPassword(@Body() data: { reset_token: string; new_password: string }) {
    return this.authService.resetPassword(data.reset_token, data.new_password);
  }
}
