import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BookingItem } from './booking-item.entity';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'stock_quantity' })
    stockQuantity: number;

    @Column({ name: 'image_url' })
    imageUrl: string;

    @Column({ name: 'release_date', nullable: true })
    releaseDate: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => BookingItem, (bookingItem: BookingItem) => bookingItem.game)
    bookingItems: BookingItem[];
}
