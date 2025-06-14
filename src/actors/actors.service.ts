import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Actor } from './actors.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorsRepository: Repository<Actor>,
  ) {}

  async createActor(createActorDto: CreateActorDto): Promise<Actor> {
    try {
      const actor = this.actorsRepository.create({
        first_name: createActorDto.first_name,
        last_name: createActorDto.last_name,
      });

      return await this.actorsRepository.save(actor);

    } catch (error) {
      console.error('Error creating actor:', error);

      throw new InternalServerErrorException('Failed to create actor');
    }
  }

  async findActorById(actorId: number): Promise<Actor> {
    try {
      const actor = await this.actorsRepository.findOne({
        where: { id: actorId },
        relations: ['movieActors', 'movieActors.movie'],
      });

      if (!actor) {
        throw new NotFoundException('Actor not found');
      }

      return actor;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error finding actor:', error);
      throw new InternalServerErrorException('Failed to find actor');
    }
  }

  async updateActor(id: number, updateActorDto: UpdateActorDto): Promise<Actor> {
    try {
      const actor = await this.actorsRepository.findOne({ where: { id: id } });

      if (!actor) {
        throw new NotFoundException('Actor not found');
      }

      Object.assign(actor, updateActorDto);
      return await this.actorsRepository.save(actor);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error updating actor:', error);
      throw new InternalServerErrorException('Failed to update actor');
    }
  }

  async removeActor(actorId: number): Promise<void> {
    try {
      const actor = await this.actorsRepository.findOne({
        where: { id: actorId },
      });

      if (!actor) {
        throw new NotFoundException('Actor not found');
      }

      await this.actorsRepository.remove(actor);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error removing actor:', error);
      throw new InternalServerErrorException('Failed to delete actor');
    }
  }

  async findAllActors(): Promise<Actor[]> {
    try {
      return await this.actorsRepository.find({
        relations: ['movieActors', 'movieActors.movie'],
      });

    } catch (error) {
      console.error('Error finding all actors:', error);
      throw new InternalServerErrorException('Failed to retrieve actors');
    }
  }
}