import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SalonService } from './salon.service.js';

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  // ─── Queue Routes ─────────────────────────────────────────────────────────────

  /** Create a new salon queue */
  @Post('queue')
  createQueue(
    @Body()
    body: {
      shopName: string;
      avgMinutes?: number;
      pricePerHour?: number;
      sellerId?: string;
    },
  ) {
    return this.salonService.createQueue(body);
  }

  /** Get queue for a specific seller */
  @Get('seller/:sellerId')
  getQueueBySeller(@Param('sellerId') sellerId: string) {
    return this.salonService.getQueueBySeller(sellerId);
  }

  /** List all open queues */
  @Get('queues')
  getAllQueues() {
    return this.salonService.getAllQueues();
  }

  /** Get live queue status */
  @Get(':queueId/status')
  getQueueStatus(@Param('queueId') queueId: string) {
    return this.salonService.getQueueStatus(queueId);
  }

  /** Customer joins queue */
  @Post(':queueId/join')
  joinQueue(
    @Param('queueId') queueId: string,
    @Body() body: { customerName: string; phone?: string; service?: string },
  ) {
    return this.salonService.joinQueue(queueId, body);
  }

  /** Salon calls next customer */
  @Post(':queueId/next')
  callNext(@Param('queueId') queueId: string) {
    return this.salonService.callNext(queueId);
  }

  /** Today's stats for this queue */
  @Get(':queueId/stats')
  getTodayStats(@Param('queueId') queueId: string) {
    return this.salonService.getTodayStats(queueId);
  }

  /** Update queue settings (avgMinutes, pricePerHour, isOpen) */
  @Patch(':queueId/settings')
  updateSettings(
    @Param('queueId') queueId: string,
    @Body()
    body: {
      avgMinutes?: number;
      pricePerHour?: number;
      isOpen?: boolean;
      shopName?: string;
    },
  ) {
    return this.salonService.updateQueueSettings(queueId, body);
  }

  /** Reset queue (new day) */
  @Delete(':queueId/reset')
  resetQueue(@Param('queueId') queueId: string) {
    return this.salonService.resetQueue(queueId);
  }

  // ─── Token Routes ─────────────────────────────────────────────────────────────

  /** Get a single customer's token status */
  @Get('token/:tokenId')
  getTokenStatus(@Param('tokenId') tokenId: string) {
    return this.salonService.getTokenStatus(tokenId);
  }

  /** Mark token as NO_SHOW */
  @Patch('token/:tokenId/no-show')
  markNoShow(@Param('tokenId') tokenId: string) {
    return this.salonService.markNoShow(tokenId);
  }

  /** Mark token as DONE */
  @Patch('token/:tokenId/done')
  markDone(@Param('tokenId') tokenId: string) {
    return this.salonService.markDone(tokenId);
  }
}
