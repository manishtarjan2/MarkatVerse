import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Define the base URL. In a real app this might come from env variables.
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    // We will serve the uploads directory statically under /public/uploads
    const urls = files.map(file => `${baseUrl}/public/uploads/${file.filename}`);

    return {
      message: 'Files uploaded successfully',
      urls: urls,
      files: files.map(f => ({ filename: f.filename, size: f.size })),
    };
  }
}
