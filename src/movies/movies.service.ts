import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ActorsService } from '../actors/actors.service';
import { MovieActor } from '../movieActor/movie-actor.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(MovieActor)
    private movieActorRepository: Repository<MovieActor>,
    private actorsService: ActorsService,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const existingMovie = await this.moviesRepository.findOne({
        where: { title: createMovieDto.title },
      });

      if (existingMovie) {
        throw new ConflictException(`Movie with title "${createMovieDto.title}" already exists`);
      }

      const movie = this.moviesRepository.create({
        title: createMovieDto.title,
        year: createMovieDto.year,
      });

      return await this.moviesRepository.save(movie);

    } catch (error) {

      console.error('Error creating movie:', error);
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  async removeMovie(id: number): Promise<void> {
    try {
      const result = await this.moviesRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Movie with id: ${id} not found`);
      }

    } catch (error) {
      console.error('Error removing movie:', error);
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }

  async findMovieById(id: number): Promise<Movie> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: id },
        relations: ['movieActors', 'movieActors.actor'],
      });

      if (!movie) {
        throw new NotFoundException(`Movie with id: ${id} not found`);
      }

      return movie;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error finding movie by ID:', error);
      throw new InternalServerErrorException('Failed to find movie');
    }
  }

  async findAllMovies(
    limit: number = 20,
    offset: number = 0,
  ): Promise<Movie[]> {
    try {
      return this.moviesRepository.find({
        relations: ['movieActors', 'movieActors.actor'],
        take: limit,
        skip: offset,
        order: { created_at: 'DESC' },
      });

    } catch (error) {
      console.error('Error finding all movies:', error);
      throw new InternalServerErrorException('Failed to retrieve movies');
    }
  }

  async getMovieActors(movieId: number): Promise<MovieActor[]> {
    try {
      const movie = await this.findMovieById(movieId);
      return movie.movieActors;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error getting movie actors:', error);
      throw new InternalServerErrorException('Failed to retrieve movie actors');
    }
  }

  async addActorToMovie(
    movieId: number,
    actorId: number,
    characterName?: string,
  ): Promise<Movie> {
    try {
      const movie = await this.findMovieById(movieId);
      const actor = await this.actorsService.findActorById(actorId);

      const existingMovieActor = await this.movieActorRepository.findOne({
        where: {
          movie: { id: movieId },
          actor: { id: actorId },
        },
        relations: ['movie', 'actor'],
      });

      if (existingMovieActor) {
        throw new ConflictException(
          `Actor ${actor.first_name} ${actor.last_name} is already in movie ${movie.title}`,
        );
      }

      const movieActor = this.movieActorRepository.create({
        movie,
        actor,
        character_name: characterName,
      });
      await this.movieActorRepository.save(movieActor);

      return this.findMovieById(movieId);

    } catch (error) {

      console.error('Error adding actor to movie:', error);
      throw new InternalServerErrorException('Failed to add actor to movie');
    }
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    try {
      const movie = await this.moviesRepository.findOne({ where: { id } });

      if (!movie) {
        throw new NotFoundException(`Movie with id: ${id} not found`);
      }

      Object.assign(movie, updateMovieDto);
      return await this.moviesRepository.save(movie);

    } catch (error) {

      console.error('Error updating movie:', error);
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  async removeActorFromMovie(
    movieId: number,
    actorId: number,
  ): Promise<void> {
    try {
      const movieActor = await this.movieActorRepository.findOne({
        where: {
          movie: { id: movieId },
          actor: { id: actorId },
        },
        relations: ['movie', 'actor'],
      });

      if (!movieActor) {
        throw new NotFoundException(
          `Actor with id ${actorId} is not associated with movie ${movieId}`,
        );
      }
      await this.movieActorRepository.remove(movieActor);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error removing actor from movie:', error);
      throw new InternalServerErrorException('Failed to remove actor from movie');
    }
  }
}