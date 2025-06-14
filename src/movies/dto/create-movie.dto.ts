import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  Length,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  actorIds: number[];
}
