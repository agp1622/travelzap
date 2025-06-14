import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Actor } from '../actors/actors.entity';

@Entity('movie_actors')
export class MovieActor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  character_name: string;

  @ManyToOne(() => Movie, (movie) => movie.movieActors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Actor, (actor) => actor.movieActors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: Actor;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
