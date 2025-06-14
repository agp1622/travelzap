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
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ApiTokenGuard } from '../auth/api-token.guard';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  findAll() {
    return this.actorsService.findAllActors();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.findActorById(id);
  }

  @Post()
  @UseGuards(ApiTokenGuard)
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.createActor(createActorDto);
  }

  @Patch(':id')
  @UseGuards(ApiTokenGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    return this.actorsService.updateActor(id, updateActorDto);
  }

  @Delete(':id')
  @UseGuards(ApiTokenGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.removeActor(id);
  }
}
