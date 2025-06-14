import { Max, Min, IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
