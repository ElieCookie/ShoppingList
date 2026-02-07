import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private repo: Repository<Item>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(task: string) {
    return await this.dataSource.transaction(async (manager) => {
      const res = await manager
        .createQueryBuilder(Item, 'item')
        .select('MAX(item.id)', 'max')
        .getRawOne();
      const nextId = (res.max || 0) + 1;
      const newItem = manager.create(Item, {
        id: nextId,
        task,
        status: 'Todo',
      });
      return await manager.save(newItem);
    });
  }

  async update(id: number, attrs: Partial<Item>) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    // Identify which fields are actually different from the DB
    const updatedFields = Object.keys(attrs).filter(
      (key) => attrs[key] !== item[key],
    );

    // Requirement: If no actual data changed, return "no changes"
    if (updatedFields.length === 0) {
      return 'no changes';
    }

    // Requirement: Response shows updated_fields
    Object.assign(item, attrs);
    await this.repo.save(item);

    return { updated_fields: updatedFields };
  }

  async remove(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException();
    return this.repo.remove(item);
  }
}
