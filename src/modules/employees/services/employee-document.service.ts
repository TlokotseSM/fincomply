import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class EmployeeDocumentService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads/employees';

  async uploadDocument(
    employeeId: string,
    file: Express.Multer.File,
    documentType: string,
    userId: string,
  ): Promise<{ filePath: string; fileName: string; size: number }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Create directory if not exists
    const employeeDir = path.join(
      this.uploadDir,
      employeeId,
      documentType.toLowerCase(),
    );
    if (!fs.existsSync(employeeDir)) {
      fs.mkdirSync(employeeDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${documentType.toLowerCase()}_${timestamp}_${file.originalname}`;
    const filePath = path.join(employeeDir, fileName);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    return {
      filePath: `/uploads/employees/${employeeId}/${documentType.toLowerCase()}/${fileName}`,
      fileName,
      size: file.size,
    };
  }

  async deleteDocument(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async downloadDocument(filePath: string): Promise<Buffer> {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Document not found');
    }
    return fs.readFileSync(fullPath);
  }
}
