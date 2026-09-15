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
import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
let UploadController = class UploadController {
    uploadFiles(files) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
        const urls = files.map(file => `${baseUrl}/public/uploads/${file.filename}`);
        return {
            message: 'Files uploaded successfully',
            urls: urls,
            files: files.map(f => ({ filename: f.filename, size: f.size })),
        };
    }
};
__decorate([
    Post(),
    UseInterceptors(FilesInterceptor('files', 10)),
    __param(0, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadFiles", null);
UploadController = __decorate([
    Controller('upload')
], UploadController);
export { UploadController };
//# sourceMappingURL=upload.controller.js.map