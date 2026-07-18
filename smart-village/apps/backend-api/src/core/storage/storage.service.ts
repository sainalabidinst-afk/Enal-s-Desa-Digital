import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v7 as uuidv7 } from 'uuid';

export interface UploadResult {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;
  private bucket: string;
  private endpoint: string;
  private useSSL: boolean;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'smart-village');
    this.endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    this.useSSL = this.configService.get<boolean>('MINIO_USE_SSL', false);
  }

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL: this.useSSL,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });

    // Ensure bucket exists
    const bucketExists = await this.minioClient.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucket, 'us-east-1');
      this.logger.log(`Bucket "${this.bucket}" created`);
    }

    this.logger.log(`Storage service initialized (endpoint: ${this.endpoint}:${this.configService.get('MINIO_PORT')})`);
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<UploadResult> {
    const filename = `${uuidv7()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const objectPath = `${folder}/${filename}`;

    await this.minioClient.putObject(
      this.bucket,
      objectPath,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    const protocol = this.useSSL ? 'https' : 'http';
    const url = `${protocol}://${this.endpoint}:${this.configService.get('MINIO_PORT')}/${this.bucket}/${objectPath}`;

    this.logger.debug(`File uploaded: ${objectPath} (${file.size} bytes)`);

    return {
      filename,
      originalName: file.originalname,
      url,
      path: objectPath,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(path: string): Promise<void> {
    await this.minioClient.removeObject(this.bucket, path);
    this.logger.debug(`File deleted: ${path}`);
  }

  async getSignedUrl(path: string, expirySeconds: number = 3600): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucket, path, expirySeconds);
  }

  async getFile(path: string): Promise<Buffer> {
    const stream = await this.minioClient.getObject(this.bucket, path);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}