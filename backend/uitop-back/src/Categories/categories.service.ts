import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>
  ) {}

  async findAll() {
    try {
      return { status: 200, data: await this.categoriesRepository.find() };
    } catch (error) {
      return { status: 500, error: 'Failed to fetch categories' };
    }
  }

  async create(name: string) {
    try {
      const category = this.categoriesRepository.create({ name });
      return { status: 200, data: await this.categoriesRepository.save(category) };
    } catch (error) {
      return { status: 500, error: 'Failed to create category' };
    }
  }

  async findByName(name: string) {
    const category = await this.categoriesRepository.findOneBy({ name });
    if (!category) {
      return { status: 500, error: 'Category not found', data: null };
    }
    return { status: 200, data: category };
  }
}
