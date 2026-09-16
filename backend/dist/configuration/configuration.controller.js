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
import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ConfigurationService } from './configuration.service.js';
import { MainType } from '@prisma/client';
let ConfigurationController = class ConfigurationController {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getBusinessTypes(mainType) {
        return this.configService.getBusinessTypes(mainType);
    }
    createBusinessType(data) {
        return this.configService.createBusinessType(data);
    }
    getSectors(businessTypeId) {
        return this.configService.getSectors(businessTypeId);
    }
    createSector(data) {
        return this.configService.createSector(data);
    }
    updateSector(id, data) {
        return this.configService.updateSector(id, data);
    }
    getCategories(sectorId) {
        return this.configService.getCategories(sectorId);
    }
    createCategory(data) {
        return this.configService.createCategory(data);
    }
    getWorkflows() {
        return this.configService.getWorkflows();
    }
    createWorkflow(data) {
        return this.configService.createWorkflow(data);
    }
    getSystemSettings() {
        return this.configService.getSystemSettings();
    }
    updateSystemSettings(data) {
        return this.configService.updateSystemSettings(data);
    }
};
__decorate([
    Get('business-types'),
    __param(0, Query('mainType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getBusinessTypes", null);
__decorate([
    Post('business-types'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "createBusinessType", null);
__decorate([
    Get('sectors'),
    __param(0, Query('businessTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getSectors", null);
__decorate([
    Post('sectors'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "createSector", null);
__decorate([
    Patch('sectors/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "updateSector", null);
__decorate([
    Get('categories'),
    __param(0, Query('sectorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getCategories", null);
__decorate([
    Post('categories'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "createCategory", null);
__decorate([
    Get('workflows'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getWorkflows", null);
__decorate([
    Post('workflows'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "createWorkflow", null);
__decorate([
    Get('system-settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "getSystemSettings", null);
__decorate([
    Post('system-settings'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "updateSystemSettings", null);
ConfigurationController = __decorate([
    Controller('configuration'),
    __metadata("design:paramtypes", [ConfigurationService])
], ConfigurationController);
export { ConfigurationController };
//# sourceMappingURL=configuration.controller.js.map