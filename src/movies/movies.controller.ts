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
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTokenGuard } from '../auth/api-token.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(ApiTokenGuard)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAllMovies();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findMovieById(id);
  }

  @Get(':id/actors')
  findMovieActors(@Param('id', ParseIntPipe) movieId: number) {
    return this.moviesService.getMovieActors(movieId);
  }

  @Patch(':id')
  @UseGuards(ApiTokenGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(ApiTokenGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.removeMovie(id);
  }

  @Post(':id/actors')
  @UseGuards(ApiTokenGuard)
  addActors(
    @Param('id', ParseIntPipe) movieId: number,
    @Body()
    actors: Array<{
      actor_id: number;
      character_name?: string;
    }>,
  ) {
    return Promise.all(
      actors.map((actor) =>
        this.moviesService.addActorToMovie(
          movieId,
          actor.actor_id,
          actor.character_name,
        ),
      ),
    );
  }

  @Post(':movieId/actors/:actorId')
  @UseGuards(ApiTokenGuard)
  addSingleActor(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
    @Body() body: { character_name?: string } = {},
  ) {
    return this.moviesService.addActorToMovie(movieId, actorId, body.character_name);
  }

  @Delete(':movieId/actors/:actorId')
  @UseGuards(ApiTokenGuard)
  removeActor(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ) {
    return this.moviesService.removeActorFromMovie(movieId, actorId);
  }
}