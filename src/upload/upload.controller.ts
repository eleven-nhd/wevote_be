import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
@Public()
export class UploadController {
  constructor(private readonly minioService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const path = await this.minioService.uploadFile(file, 'images');

    return {
      filePath: path,
      url: this.minioService.getFileUrl(path),
    };
  }
}
