var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let IdGeneratorService = class IdGeneratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNextId(type, prefix, padLength = 6) {
        const counter = await this.prisma.counter.upsert({
            where: { id: type },
            update: { seq: { increment: 1 } },
            create: { id: type, seq: 1 },
        });
        const paddedSeq = String(counter.seq).padStart(padLength, '0');
        return `${prefix}${paddedSeq}`;
    }
    getDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    async generateUserId() {
        return this.getNextId('User', 'MV-', 10);
    }
    async generateAdminId() {
        return this.getNextId('Admin', 'MV-ADM-', 6);
    }
    async generateStaffId() {
        return this.getNextId('Staff', 'MV-STF-', 6);
    }
    async generateBusinessId(type = 'SELLER') {
        let prefix = 'MV-BIZ-';
        if (type === 'SELLER')
            prefix = 'MV-SEL-';
        else if (type === 'SERVICE')
            prefix = 'MV-SPR-';
        else if (type === 'MANUFACTURER')
            prefix = 'MV-MFG-';
        else if (type === 'DISTRIBUTOR' || type === 'WHOLESALER')
            prefix = 'MV-DIS-';
        return this.getNextId(`Business_${type}`, prefix, 6);
    }
    async generateProductId() {
        return this.getNextId('Product', 'MV-PRD-', 6);
    }
    async generateServiceId() {
        return this.getNextId('Service', 'MV-SRV-', 6);
    }
    async generateReviewId() {
        return this.getNextId('Review', 'MV-REV-', 6);
    }
    async generateRequirementId() {
        const dateStr = this.getDateString();
        return this.getNextId('Requirement', `MV-REQ-${dateStr}-`, 6);
    }
    async generateRfqId() {
        const dateStr = this.getDateString();
        return this.getNextId('RFQ', `MV-RFQ-${dateStr}-`, 6);
    }
    async generateQuotationId() {
        const dateStr = this.getDateString();
        return this.getNextId('Quotation', `MV-QTN-${dateStr}-`, 6);
    }
    async generateAppointmentId() {
        const dateStr = this.getDateString();
        return this.getNextId('Appointment', `MV-APT-${dateStr}-`, 6);
    }
    async generateBookingId(isToken = false) {
        const dateStr = this.getDateString();
        if (isToken) {
            return this.getNextId('Token', `MV-TKN-${dateStr}-`, 6);
        }
        return this.getNextId('Booking', `MV-BKG-${dateStr}-`, 6);
    }
    async generateOrderId() {
        const dateStr = this.getDateString();
        return this.getNextId('Order', `MV-ORD-${dateStr}-`, 6);
    }
    async generatePaymentId() {
        const dateStr = this.getDateString();
        return this.getNextId('Payment', `MV-PAY-${dateStr}-`, 6);
    }
    async generateInvoiceId() {
        const dateStr = this.getDateString();
        return this.getNextId('Invoice', `MV-INV-${dateStr}-`, 6);
    }
    async generateShipmentId() {
        const dateStr = this.getDateString();
        return this.getNextId('Shipment', `MV-SHP-${dateStr}-`, 6);
    }
    async generateAuditLogId() {
        return this.getNextId('AuditLog', 'AUD-', 6);
    }
};
IdGeneratorService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], IdGeneratorService);
export { IdGeneratorService };
//# sourceMappingURL=id-generator.service.js.map