import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './Todos/todos.module';
import { Todo } from './Todos/todos.entity';
import { Category } from './Categories/categories.entity';
import { CategoriesModule } from './Categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'dev.db',
      entities: [Todo, Category],
      synchronize: true,
    }),
    TodosModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
