import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SalonService {
  constructor(private prisma: PrismaService) {}

  // ─── Queue Management ────────────────────────────────────────────────────────

  /** Create a new queue for a salon */
  async createQueue(data: {
    shopName: string;
    avgMinutes?: number;
    pricePerHour?: number;
  }) {
    return this.prisma.salonQueue.create({
      data: {
        shopName: data.shopName,
        avgMinutes: data.avgMinutes ?? 20,
        pricePerHour: data.pricePerHour ?? 0,
        currentToken: 0,
        lastToken: 0,
        isOpen: true,
      },
    });
  }

  /** Get all queues (for listing salons) */
  async getAllQueues() {
    return this.prisma.salonQueue.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get live status of a queue */
  async getQueueStatus(queueId: string) {
    const queue = await this.prisma.salonQueue.findUnique({
      where: { id: queueId },
    });
    if (!queue) throw new NotFoundException('Queue not found');

    const waiting = await this.prisma.salonToken.findMany({
      where: { queueId, status: 'WAITING' },
      orderBy: { tokenNumber: 'asc' },
    });

    const serving = await this.prisma.salonToken.findFirst({
      where: { queueId, status: 'SERVING' },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const doneToday = await this.prisma.salonToken.count({
      where: { queueId, status: 'DONE', doneAt: { gte: todayStart } },
    });

    return {
      queue,
      serving,
      waiting,
      waitingCount: waiting.length,
      doneToday,
      estimatedWaitForNext: waiting.length > 0 ? queue.avgMinutes : 0,
    };
  }

  // ─── Token Management ─────────────────────────────────────────────────────────

  /** Customer joins the queue and gets a token */
  async joinQueue(
    queueId: string,
    data: { customerName: string; phone?: string; service?: string },
  ) {
    const queue = await this.prisma.salonQueue.findUnique({
      where: { id: queueId },
    });
    if (!queue) throw new NotFoundException('Queue not found');
    if (!queue.isOpen) throw new NotFoundException('This salon queue is closed');

    // Increment lastToken to assign next number
    const updated = await this.prisma.salonQueue.update({
      where: { id: queueId },
      data: { lastToken: { increment: 1 } },
    });

    const tokenNumber = updated.lastToken;

    // How many tokens are ahead?
    const ahead = await this.prisma.salonToken.count({
      where: { queueId, status: 'WAITING' },
    });

    const estimatedWaitMin = ahead * queue.avgMinutes;

    const token = await this.prisma.salonToken.create({
      data: {
        queueId,
        tokenNumber,
        customerName: data.customerName,
        phone: data.phone,
        service: data.service ?? 'Haircut',
        status: 'WAITING',
      },
    });

    return { token, estimatedWaitMin, ahead };
  }

  /** Get a single token's status with full queue context (for customer tracking) */
  async getTokenStatus(tokenId: string) {
    const token = await this.prisma.salonToken.findUnique({
      where: { id: tokenId },
      include: { queue: true },
    });
    if (!token) throw new NotFoundException('Token not found');

    const queue = token.queue;

    // How many are ahead of this token and still waiting
    const ahead = await this.prisma.salonToken.count({
      where: {
        queueId: token.queueId,
        status: 'WAITING',
        tokenNumber: { lt: token.tokenNumber },
      },
    });

    const serving = await this.prisma.salonToken.findFirst({
      where: { queueId: token.queueId, status: 'SERVING' },
    });

    const estimatedWaitMin =
      token.status === 'WAITING'
        ? ahead * queue.avgMinutes + (serving ? queue.avgMinutes : 0)
        : 0;

    // Fetch ALL tokens in queue for visual timeline
    // — last 5 DONE, current SERVING, and all WAITING up to customer's token
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const recentDone = await this.prisma.salonToken.findMany({
      where: { queueId: token.queueId, status: 'DONE', doneAt: { gte: todayStart } },
      orderBy: { tokenNumber: 'desc' },
      take: 5,
      select: { id: true, tokenNumber: true, customerName: true, service: true, status: true, doneAt: true },
    });

    const waitingTokens = await this.prisma.salonToken.findMany({
      where: { queueId: token.queueId, status: 'WAITING' },
      orderBy: { tokenNumber: 'asc' },
      select: { id: true, tokenNumber: true, customerName: true, service: true, status: true },
    });

    const doneToday = await this.prisma.salonToken.count({
      where: { queueId: token.queueId, status: 'DONE', doneAt: { gte: todayStart } },
    });

    return {
      token,
      ahead,
      serving,
      estimatedWaitMin,
      queue,
      recentDone: recentDone.reverse(), // oldest first
      waitingTokens,
      doneToday,
    };
  }

  // ─── Salon Staff Actions ──────────────────────────────────────────────────────

  /** Call the next customer (mark current SERVING token as DONE, next WAITING as SERVING) */
  async callNext(queueId: string) {
    const queue = await this.prisma.salonQueue.findUnique({
      where: { id: queueId },
    });
    if (!queue) throw new NotFoundException('Queue not found');

    // Mark currently serving token as DONE
    const currentlyServing = await this.prisma.salonToken.findFirst({
      where: { queueId, status: 'SERVING' },
    });
    if (currentlyServing) {
      await this.prisma.salonToken.update({
        where: { id: currentlyServing.id },
        data: { status: 'DONE', doneAt: new Date() },
      });
    }

    // Get next WAITING token
    const nextToken = await this.prisma.salonToken.findFirst({
      where: { queueId, status: 'WAITING' },
      orderBy: { tokenNumber: 'asc' },
    });

    if (!nextToken) {
      // No more waiting — update currentToken to last
      await this.prisma.salonQueue.update({
        where: { id: queueId },
        data: { currentToken: queue.lastToken },
      });
      return { message: 'Queue is empty', serving: null };
    }

    // Mark next token as SERVING
    const serving = await this.prisma.salonToken.update({
      where: { id: nextToken.id },
      data: { status: 'SERVING', servedAt: new Date() },
    });

    // Update queue's currentToken
    await this.prisma.salonQueue.update({
      where: { id: queueId },
      data: { currentToken: serving.tokenNumber },
    });

    return { message: 'Next customer called', serving };
  }

  /** Mark a token as NO_SHOW */
  async markNoShow(tokenId: string) {
    const token = await this.prisma.salonToken.findUnique({
      where: { id: tokenId },
    });
    if (!token) throw new NotFoundException('Token not found');

    return this.prisma.salonToken.update({
      where: { id: tokenId },
      data: { status: 'NO_SHOW', doneAt: new Date() },
    });
  }

  /** Mark a token as DONE manually */
  async markDone(tokenId: string) {
    return this.prisma.salonToken.update({
      where: { id: tokenId },
      data: { status: 'DONE', doneAt: new Date() },
    });
  }

  /** Get today's stats for a queue */
  async getTodayStats(queueId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [done, noShow, waiting, serving, queue] = await Promise.all([
      this.prisma.salonToken.count({
        where: { queueId, status: 'DONE', doneAt: { gte: todayStart } },
      }),
      this.prisma.salonToken.count({
        where: { queueId, status: 'NO_SHOW', doneAt: { gte: todayStart } },
      }),
      this.prisma.salonToken.count({
        where: { queueId, status: 'WAITING' },
      }),
      this.prisma.salonToken.count({
        where: { queueId, status: 'SERVING' },
      }),
      this.prisma.salonQueue.findUnique({ where: { id: queueId } }),
    ]);

    const totalHours = (done * (queue?.avgMinutes ?? 20)) / 60;
    const estimatedRevenue = totalHours * (queue?.pricePerHour ?? 0);

    return { done, noShow, waiting, serving, totalHours, estimatedRevenue, queue };
  }

  /** Update queue settings */
  async updateQueueSettings(
    queueId: string,
    data: { avgMinutes?: number; pricePerHour?: number; isOpen?: boolean; shopName?: string },
  ) {
    return this.prisma.salonQueue.update({
      where: { id: queueId },
      data,
    });
  }

  /** Reset queue (clear all tokens for a new day) */
  async resetQueue(queueId: string) {
    await this.prisma.salonToken.deleteMany({ where: { queueId } });
    return this.prisma.salonQueue.update({
      where: { id: queueId },
      data: { currentToken: 0, lastToken: 0 },
    });
  }
}
