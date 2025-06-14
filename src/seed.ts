import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Movie } from './movies/entities/movie.entity';
import { Actor } from './actors/actors.entity';
import { Rating } from './ratings/entities/ratings.entity';
import { MovieActor } from './movieActor/movie-actor.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const movieRepo = dataSource.getRepository(Movie);
  const actorRepo = dataSource.getRepository(Actor);
  const ratingRepo = dataSource.getRepository(Rating);
  const movieActorRepo = dataSource.getRepository(MovieActor);

  await dataSource.query(`DELETE FROM ratings`);
  await dataSource.query(`DELETE FROM movies`);
  await dataSource.query(`DELETE FROM movie_actors`);
  await dataSource.query(`DELETE FROM actors`);

  const actor1 = actorRepo.create({ first_name: 'Tom', last_name: 'Hanks' });
  const actor2 = actorRepo.create({ first_name: 'Robin', last_name: 'Wright' });
  const actor3 = actorRepo.create({ first_name: 'Keanu', last_name: 'Reeves' });

  await actorRepo.save([actor1, actor2, actor3]);

  const movie1 = movieRepo.create({ title: 'Forrest Gump', year: 1994 });
  const movie2 = movieRepo.create({ title: 'The Matrix', year: 1999 });

  await movieRepo.save([movie1, movie2]);

  const rating1 = ratingRepo.create({ rating: 5, movie: movie1 });
  const rating2 = ratingRepo.create({ rating: 4, movie: movie1 });
  const rating3 = ratingRepo.create({ rating: 5, movie: movie2 });

  await ratingRepo.save([rating1, rating2, rating3]);

  const ma1 = movieActorRepo.create({ movie: movie1, actor: actor1 });
  const ma2 = movieActorRepo.create({ movie: movie1, actor: actor2 });
  const ma3 = movieActorRepo.create({ movie: movie2, actor: actor3 });

  await movieActorRepo.save([ma1, ma2, ma3]);

  console.log('🎉 Database seeding completed!');
  await app.close();
}

seed();
