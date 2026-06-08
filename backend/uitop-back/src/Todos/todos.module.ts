import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./todos.entity";
import { CategoriesModule } from "src/Categories/categories.module";




@Module({
    imports: [
        TypeOrmModule.forFeature([Todo]),
        CategoriesModule
    ],
    providers: [TodosService],
    controllers: [TodosController],
})
export class TodosModule {}
