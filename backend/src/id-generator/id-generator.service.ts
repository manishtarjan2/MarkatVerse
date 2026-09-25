import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class IdGeneratorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a new unique custom ID by incrementing a counter in MongoDB.
   * @param type The type of ID to generate (e.g. "User", "Business", "Order")
   * @param prefix The prefix for the ID (e.g. "MV-", "BUS-", "ORD-")
   * @param base The base number to add the sequence to (e.g. 100000)
   * @returns The generated custom string ID
   */
  private async getNextId(type: string, prefix: string, padLength: number = 6): Promise<string> {
    const counter = await this.prisma.counter.upsert({
      where: { id: type },
      update: { seq: { increment: 1 } },
      create: { id: type, seq: 1 },
    });
    
    // Pad the sequence with leading zeros
    const paddedSeq = String(counter.seq).padStart(padLength, '0');
    return `${prefix}${paddedSeq}`;
  }

  private getDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // --- ACCOUNTS & USERS ---
  async generateUserId(): Promise<string> {
    return this.getNextId('User', 'MV-', 10);
  }

  async generateAdminId(): Promise<string> {
    return this.getNextId('Admin', 'MV-ADM-', 6);
  }

  async generateStaffId(): Promise<string> {
    return this.getNextId('Staff', 'MV-STF-', 6);
  }

  // --- BUSINESS PROFILES ---
  async generateBusinessId(type: string = 'SELLER'): Promise<string> {
    let prefix = 'MV-BIZ-';
    if (type === 'SELLER') prefix = 'MV-SEL-';
    else if (type === 'SERVICE') prefix = 'MV-SPR-';
    else if (type === 'MANUFACTURER') prefix = 'MV-MFG-';
    else if (type === 'DISTRIBUTOR' || type === 'WHOLESALER') prefix = 'MV-DIS-';
    
    return this.getNextId(`Business_${type}`, prefix, 6);
  }

  // --- COMMERCE & CATALOG ---
  async generateProductId(): Promise<string> {
    return this.getNextId('Product', 'MV-PRD-', 6);
  }

  async generateServiceId(): Promise<string> {
    return this.getNextId('Service', 'MV-SRV-', 6);
  }

  async generateReviewId(): Promise<string> {
    return this.getNextId('Review', 'MV-REV-', 6);
  }

  // --- B2B / NEGOTIATIONS ---
  async generateRequirementId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Requirement', `MV-REQ-${dateStr}-`, 6);
  }

  async generateRfqId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('RFQ', `MV-RFQ-${dateStr}-`, 6);
  }

  async generateQuotationId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Quotation', `MV-QTN-${dateStr}-`, 6);
  }

  // --- APPOINTMENTS & TOKENS ---
  async generateAppointmentId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Appointment', `MV-APT-${dateStr}-`, 6);
  }

  async generateBookingId(isToken: boolean = false): Promise<string> {
    const dateStr = this.getDateString();
    if (isToken) {
      return this.getNextId('Token', `MV-TKN-${dateStr}-`, 6);
    }
    return this.getNextId('Booking', `MV-BKG-${dateStr}-`, 6);
  }

  // --- ORDERS & LOGISTICS ---
  async generateOrderId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Order', `MV-ORD-${dateStr}-`, 6);
  }

  async generatePaymentId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Payment', `MV-PAY-${dateStr}-`, 6);
  }

  async generateInvoiceId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Invoice', `MV-INV-${dateStr}-`, 6);
  }

  async generateShipmentId(): Promise<string> {
    const dateStr = this.getDateString();
    return this.getNextId('Shipment', `MV-SHP-${dateStr}-`, 6);
  }

  // --- SYSTEM LOGS ---
  async generateAuditLogId(): Promise<string> {
    return this.getNextId('AuditLog', 'AUD-', 6);
  }
}
