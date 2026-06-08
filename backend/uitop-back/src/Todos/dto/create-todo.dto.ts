import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsString()
  categoryName?: string;

  @IsString()
  @IsIn(['inProgress', 'completed'])
  status: 'inProgress' | 'completed' = 'inProgress';
}
