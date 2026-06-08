import { Category } from "src/Categories/categories.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column({ default: 'inProgress' })
  status!: 'inProgress' | 'completed';

  @Column({ nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "categoryId" })
  category!: Category | null;
}
