import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";




@Controller('todos')
export class TodosController {
constructor(private readonly todosService: TodosService) {}

@Get()
findAll() {
    return this.todosService.findAll();
}

@Post()
create(@Body() createTodoDto: CreateTodoDto) {
    console.log('GOT RQ', createTodoDto);
    return this.todosService.create(createTodoDto);
}


@Patch(':id')
update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
) {
    
    console.log('GOT RQ', id, updateTodoDto);
    
    return this.todosService.update(id, updateTodoDto);
}

@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
}


}