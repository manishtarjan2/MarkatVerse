import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';

@Controller('admin/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('sms')
  async getSmsTemplates() {
    return this.notificationsService.getSmsTemplates();
  }

  @Post('sms')
  async createSmsTemplate(@Body() data: { title: string; message: string; status?: string }) {
    return this.notificationsService.createSmsTemplate(data);
  }

  @Put('sms/:id')
  async updateSmsTemplate(@Param('id') id: string, @Body() data: any) {
    return this.notificationsService.updateSmsTemplate(id, data);
  }

  @Delete('sms/:id')
  async deleteSmsTemplate(@Param('id') id: string) {
    return this.notificationsService.deleteSmsTemplate(id);
  }

  // --- PUSH ---
  @Get('push')
  async getPushTemplates() {
    return this.notificationsService.getPushTemplates();
  }

  @Post('push')
  async createPushTemplate(@Body() data: { title: string; message: string; status?: string }) {
    return this.notificationsService.createPushTemplate(data);
  }

  @Put('push/:id')
  async updatePushTemplate(@Param('id') id: string, @Body() data: any) {
    return this.notificationsService.updatePushTemplate(id, data);
  }

  @Delete('push/:id')
  async deletePushTemplate(@Param('id') id: string) {
    return this.notificationsService.deletePushTemplate(id);
  }
  // --- EMAIL ---
  @Get('email')
  async getEmailTemplates() {
    return this.notificationsService.getEmailTemplates();
  }

  @Post('email')
  async createEmailTemplate(@Body() data: { title: string; message: string; status?: string }) {
    return this.notificationsService.createEmailTemplate(data);
  }

  @Put('email/:id')
  async updateEmailTemplate(@Param('id') id: string, @Body() data: any) {
    return this.notificationsService.updateEmailTemplate(id, data);
  }

  @Delete('email/:id')
  async deleteEmailTemplate(@Param('id') id: string) {
    return this.notificationsService.deleteEmailTemplate(id);
  }
}
