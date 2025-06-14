import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  Length,
  IsNumber,
} from 'class-validator';
import { type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsNumber()
  year: number;
}
