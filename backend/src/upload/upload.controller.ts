import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Define the base URL. In a real app this might come from env variables.
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    // We will serve the uploads directory statically under /public/uploads
    const fileUrl = `${baseUrl}/public/uploads/${file.filename}`;

    return {
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      size: file.size,
    };
  }
}
