import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  private logger = new Logger('AuditLog');

  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    userId?: string;
    action: AuditAction | string;
    entity: string;
    entityId?: string;
    status?: 'success' | 'failed' | 'pending';
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    method?: string;
    endpoint?: string;
  }): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create({
      userId: data.userId,
      action: data.action as AuditAction,
      entity: data.entity,
      entityId: data.entityId,
      status: data.status || 'success',
      details: data.details ? JSON.stringify(data.details) : null,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      method: data.method,
      endpoint: data.endpoint,
    });

    const saved = await this.auditLogsRepository.save(auditLog);

    // Log to application logger as well
    this.logger.log(
      `[${data.action}] User: ${data.userId || 'Anonymous'}, Entity: ${data.entity}, Status: ${data.status}`,
    );

    return saved;
  }

  async getLogs(filters: {
    userId?: string;
    action?: string;
    entity?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<[AuditLog[], number]> {
    const query = this.auditLogsRepository.createQueryBuilder('audit');

    if (filters.userId) {
      query.andWhere('audit.userId = :userId', { userId: filters.userId });
    }

    if (filters.action) {
      query.andWhere('audit.action = :action', { action: filters.action });
    }

    if (filters.entity) {
      query.andWhere('audit.entity = :entity', { entity: filters.entity });
    }

    if (filters.status) {
      query.andWhere('audit.status = :status', { status: filters.status });
    }

    query.orderBy('audit.createdAt', 'DESC');
    query.take(filters.limit || 50);
    query.skip(filters.offset || 0);

    return query.getManyAndCount();
  }

  async getUserAuditLog(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}