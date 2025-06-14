import { IsString, IsOptional, IsDateString, IsUrl, Length } from 'class-validator';


export class CreateActorDto{
  @IsString()
  @Length(8, 10)
  first_name: string;

  @IsString()
  @Length(8, 10)
  last_name: string;
}