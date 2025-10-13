import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Currency } from './currency.entity';

@Entity('exchange_rates')
@Index(['fromCurrencyCode', 'toCurrencyCode', 'date'], { unique: true })
export class ExchangeRate extends BaseEntity {
  @Column({ name: 'from_currency_code', length: 3 })
  fromCurrencyCode: string;

  @Column({ name: 'to_currency_code', length: 3 })
  toCurrencyCode: string;

  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  rate: number;

  @Column({ name: 'inverse_rate', type: 'decimal', precision: 18, scale: 8 })
  inverseRate: number;

  @Column({ length: 100, default: 'manual' })
  source: string; // e.g., 'manual', 'exchangeratesapi', 'openexchangerates'

  @Column({ name: 'source_timestamp', type: 'timestamptz', nullable: true })
  sourceTimestamp?: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => Currency, currency => currency.exchangeRatesFrom)
  @JoinColumn({ name: 'from_currency_code', referencedColumnName: 'code' })
  fromCurrency: Currency;

  @ManyToOne(() => Currency, currency => currency.exchangeRatesTo)
  @JoinColumn({ name: 'to_currency_code', referencedColumnName: 'code' })
  toCurrency: Currency;
}