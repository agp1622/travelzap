import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiTokenGuard } from '../auth/api-token.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  findAll() {
    return this.ratingsService.findAllRatings();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.findRatingById(id);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.ratingsService.findRatingsByMovie(movieId);
  }

  @Post()
  @UseGuards(ApiTokenGuard)
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.createRating(createRatingDto);
  }

  @Patch(':id')
  @UseGuards(ApiTokenGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(ApiTokenGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.removeRating(id);
  }
}
