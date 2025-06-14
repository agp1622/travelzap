import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/ratings.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: createRatingDto.movieId }
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${createRatingDto.movieId} not found`);
      }

      const rating = this.ratingsRepository.create({
        rating: createRatingDto.rating,
        movie: movie
      });

      return await this.ratingsRepository.save(rating);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error creating rating:', error);
      throw new InternalServerErrorException('Failed to create rating');
    }
  }

  async findAllRatings(): Promise<Rating[]> {
    try {
      return await this.ratingsRepository.find({
        relations: ['movie'],
        order: { created_at: 'DESC' },
      });

    } catch (error) {
      console.error('Error finding all ratings:', error);
      throw new InternalServerErrorException('Failed to retrieve ratings');
    }
  }

  async findRatingById(id: number): Promise<Rating> {
    try {
      const rating = await this.ratingsRepository.findOne({
        where: { id },
        relations: ['movie'],
      });

      if (!rating) {
        throw new NotFoundException(`Rating with ID ${id} not found`);
      }

      return rating;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error finding rating by ID:', error);
      throw new InternalServerErrorException('Failed to find rating');
    }
  }

  async findRatingsByMovie(movieId: number): Promise<Rating[]> {
    try {
      return await this.ratingsRepository.find({
        where: { movie: { id: movieId } },
        relations: ['movie'],
        order: { created_at: 'DESC' },
      });

    } catch (error) {
      console.error('Error finding ratings by movie:', error);
      throw new InternalServerErrorException('Failed to retrieve movie ratings');
    }
  }

  async updateRating(id: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    try {
      const rating = await this.ratingsRepository.findOne({ where: { id } });

      if (!rating) {
        throw new NotFoundException(`Rating with ID ${id} not found`);
      }

      Object.assign(rating, updateRatingDto);
      return await this.ratingsRepository.save(rating);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error updating rating:', error);
      throw new InternalServerErrorException('Failed to update rating');
    }
  }

  async removeRating(id: number): Promise<void> {
    try {
      const result = await this.ratingsRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Rating with ID ${id} not found`);
      }

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error removing rating:', error);
      throw new InternalServerErrorException('Failed to delete rating');
    }
  }
}