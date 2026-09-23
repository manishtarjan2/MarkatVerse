var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommercialService } from './commercial.service.js';
let CommercialController = class CommercialController {
    commercialService;
    constructor(commercialService) {
        this.commercialService = commercialService;
    }
    getAdvertisements() { return this.commercialService.getAdvertisements(); }
    getAdvertisement(id) { return this.commercialService.getAdvertisement(id); }
    createAdvertisement(data) { return this.commercialService.createAdvertisement(data); }
    updateAdvertisement(id, data) { return this.commercialService.updateAdvertisement(id, data); }
    deleteAdvertisement(id) { return this.commercialService.deleteAdvertisement(id); }
    getCoupons() { return this.commercialService.getCoupons(); }
    getCoupon(id) { return this.commercialService.getCoupon(id); }
    createCoupon(data) { return this.commercialService.createCoupon(data); }
    updateCoupon(id, data) { return this.commercialService.updateCoupon(id, data); }
    deleteCoupon(id) { return this.commercialService.deleteCoupon(id); }
    getSubscriptions() { return this.commercialService.getSubscriptions(); }
    getSubscription(id) { return this.commercialService.getSubscription(id); }
    createSubscription(data) { return this.commercialService.createSubscription(data); }
    updateSubscription(id, data) { return this.commercialService.updateSubscription(id, data); }
    deleteSubscription(id) { return this.commercialService.deleteSubscription(id); }
    getCommissions() { return this.commercialService.getCommissions(); }
    getCommission(id) { return this.commercialService.getCommission(id); }
    createCommission(data) { return this.commercialService.createCommission(data); }
    updateCommission(id, data) { return this.commercialService.updateCommission(id, data); }
    deleteCommission(id) { return this.commercialService.deleteCommission(id); }
};
__decorate([
    Get('advertisements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getAdvertisements", null);
__decorate([
    Get('advertisements/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getAdvertisement", null);
__decorate([
    Post('advertisements'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "createAdvertisement", null);
__decorate([
    Patch('advertisements/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "updateAdvertisement", null);
__decorate([
    Delete('advertisements/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "deleteAdvertisement", null);
__decorate([
    Get('coupons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getCoupons", null);
__decorate([
    Get('coupons/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getCoupon", null);
__decorate([
    Post('coupons'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "createCoupon", null);
__decorate([
    Patch('coupons/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "updateCoupon", null);
__decorate([
    Delete('coupons/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "deleteCoupon", null);
__decorate([
    Get('subscriptions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getSubscriptions", null);
__decorate([
    Get('subscriptions/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getSubscription", null);
__decorate([
    Post('subscriptions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "createSubscription", null);
__decorate([
    Patch('subscriptions/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "updateSubscription", null);
__decorate([
    Delete('subscriptions/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "deleteSubscription", null);
__decorate([
    Get('commissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getCommissions", null);
__decorate([
    Get('commissions/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "getCommission", null);
__decorate([
    Post('commissions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "createCommission", null);
__decorate([
    Patch('commissions/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "updateCommission", null);
__decorate([
    Delete('commissions/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommercialController.prototype, "deleteCommission", null);
CommercialController = __decorate([
    Controller('commercial'),
    __metadata("design:paramtypes", [CommercialService])
], CommercialController);
export { CommercialController };
//# sourceMappingURL=commercial.controller.js.map