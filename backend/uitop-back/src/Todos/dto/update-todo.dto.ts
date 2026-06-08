import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsIn(['inProgress', 'completed'])
  status?: 'inProgress' | 'completed';
}
