import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  Length,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateActorDto {
  @IsString()
  @Length(2, 20)
  first_name: string;

  @IsString()
  @Length(2, 20)
  last_name: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  movieIds?: number[];
}
