import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";
import { InjectRepository } from "@nestjs/typeorm/dist/common/typeorm.decorators";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from "src/Categories/categories.service";
import { Category } from "src/Categories/categories.entity";



@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todosRepository: Repository<Todo>,
        private readonly categoriesService: CategoriesService,
    ) {}

    async findAll() {
        try{
            return {status: 200, data: await this.todosRepository.find()};
        }catch (error) {
            return {status: 500, error: 'Failed to fetch todos' };
        }
    }

    async create(createTodoDto: CreateTodoDto) {
        let categoryId: number | null = null;

        if (createTodoDto.categoryName) {
            const existingCategory = await this.categoriesService.findByName(createTodoDto.categoryName);
            let category: Category | null = null;

            if (existingCategory.error && existingCategory.status === 500) {
               const newCategory = await this.categoriesService.create(createTodoDto.categoryName);

                if (newCategory.error || !newCategory.data) {
                    return { status: 500, error: 'Failed to create category' };
                }
                console.log('SET NEW CATEGORY TO', newCategory);
                
                category = newCategory.data; 
            } else {
                console.log('SET EXISTING CATEGORY TO', existingCategory);
                category = existingCategory.data;
            }

            if(category === null) {
                return { status: 500, error: 'Failed to fetch or create category' };
            }
            categoryId = category.id;

            const isCategoryFull =
                (await this.todosRepository.count({ where: { categoryId } })) >= 5;
            if (isCategoryFull) {
                return { status: 400, error: 'Category is full' };
            }
        }
        console.log('CREATING TASK', categoryId, createTodoDto);
        
        const todo = this.todosRepository.create({
            text: createTodoDto.text,
            categoryId,
        });

        return { status: 200, data: await this.todosRepository.save(todo) };
    }

    async update(id: number, updateTodoDto: UpdateTodoDto) {
        await this.todosRepository.update(id, {
            ...updateTodoDto,
        });

        const updatedTodo = await this.todosRepository.findOneBy({ id });
        return { status: 200, data: updatedTodo };
    }

    async remove(id: number) {
        await this.todosRepository.delete(id);
        return { status: 200, data: { deleted: true } };
    }


}
