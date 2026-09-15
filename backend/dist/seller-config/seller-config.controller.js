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
import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { SellerConfigService } from './seller-config.service.js';
let SellerConfigController = class SellerConfigController {
    sellerConfigService;
    constructor(sellerConfigService) {
        this.sellerConfigService = sellerConfigService;
    }
    async getCapabilities(userId) {
        return this.sellerConfigService.getSellerCapabilities(userId);
    }
    async updateCapabilities(businessId, features) {
        return this.sellerConfigService.updateSellerCapabilities(businessId, features);
    }
};
__decorate([
    Get(':userId'),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SellerConfigController.prototype, "getCapabilities", null);
__decorate([
    Patch('business/:businessId/capabilities'),
    __param(0, Param('businessId')),
    __param(1, Body('features')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SellerConfigController.prototype, "updateCapabilities", null);
SellerConfigController = __decorate([
    Controller('seller-config'),
    __metadata("design:paramtypes", [SellerConfigService])
], SellerConfigController);
export { SellerConfigController };
//# sourceMappingURL=seller-config.controller.js.map