import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/ratings.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Movie])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
