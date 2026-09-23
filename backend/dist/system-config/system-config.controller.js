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
import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SystemConfigService } from './system-config.service.js';
let SystemConfigController = class SystemConfigController {
    systemConfigService;
    constructor(systemConfigService) {
        this.systemConfigService = systemConfigService;
    }
    getSeo() {
        return this.systemConfigService.getSeoConfig();
    }
    updateSeo(body) {
        return this.systemConfigService.updateSeoConfig(body);
    }
    getAuth() {
        return this.systemConfigService.getAuthConfig();
    }
    updateAuth(body) {
        return this.systemConfigService.updateAuthConfig(body);
    }
};
__decorate([
    Get('seo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemConfigController.prototype, "getSeo", null);
__decorate([
    Patch('seo'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemConfigController.prototype, "updateSeo", null);
__decorate([
    Get('auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SystemConfigController.prototype, "getAuth", null);
__decorate([
    Patch('auth'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemConfigController.prototype, "updateAuth", null);
SystemConfigController = __decorate([
    Controller('system-config'),
    __metadata("design:paramtypes", [SystemConfigService])
], SystemConfigController);
export { SystemConfigController };
//# sourceMappingURL=system-config.controller.js.map