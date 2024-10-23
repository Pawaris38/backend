import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    const itemsCount = await this.itemsRepository.count();
    if (itemsCount === 0) {
      const items = [
        {
          name: 'Product 1',
          description: 'This is the first product.',
          price: 100.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 2',
          description: 'This is the second product.',
          price: 200.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 3',
          description: 'This is the third product.',
          price: 300.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 4',
          description: 'This is the fourth product.',
          price: 150.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 5',
          description: 'This is the fifth product.',
          price: 250.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 6',
          description: 'This is the sixth product.',
          price: 350.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 7',
          description: 'This is the seventh product.',
          price: 400.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 8',
          description: 'This is the eighth product.',
          price: 500.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 9',
          description: 'This is the ninth product.',
          price: 600.0,
          image: 'https://via.placeholder.com/400x300',
        },
        {
          name: 'Product 10',
          description: 'This is the tenth product.',
          price: 700.0,
          image: 'https://via.placeholder.com/400x300',
        },
      ];
      await this.itemsRepository.save(items);
    }
  }

  async findAll(): Promise<Item[]> {
    const cacheData = await this.cacheManager.get('product');
    if (cacheData) {
      return cacheData;
    }

    const result = await this.itemsRepository.find();
    await this.cacheManager.set('product', result, 60 * 1000); // 60 seconds
    return result;
  }
}
