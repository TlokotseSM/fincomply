import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Country } from './country.entity';
import { Payment } from './payment.entity';
import { ExchangeRate } from './exchange-rate.entity';

@Entity('currencies')
@Index(['code'], { unique: true })
export class Currency extends BaseEntity {
  @Column({ length: 3, unique: true })
  @Index()
  code: string; // ISO 4217 code (e.g., 'USD', 'EUR', 'ZAR')

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10 })
  symbol: string; // e.g., '$', '€', 'R'

  @Column({ name: 'decimal_places', type: 'int', default: 2 })
  decimalPlaces: number;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'is_crypto', default: false })
  isCrypto: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relations
  @OneToMany(() => Country, country => country.currency)
  countries: Country[];

  @OneToMany(() => Payment, payment => payment.currency)
  payments: Payment[];

  @OneToMany(() => ExchangeRate, rate => rate.fromCurrency)
  exchangeRatesFrom: ExchangeRate[];

  @OneToMany(() => ExchangeRate, rate => rate.toCurrency)
  exchangeRatesTo: ExchangeRate[];
}