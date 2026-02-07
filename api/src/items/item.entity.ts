import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn()
  id: number;

  @Column()
  task: string;

  @Column({ default: 'Todo' })
  status: 'Todo' | 'In Progress' | 'Complete';
}
