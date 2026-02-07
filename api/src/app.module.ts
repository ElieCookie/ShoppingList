import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Item } from './items/item.entity';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'backend-db',
      port: 3306,
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: 'shopping_db',
      entities: [Item],
      synchronize: true, // Only for dev/assignment
    }),
    ItemsModule,
  ],
  controllers: [AppController], // Handles the /livez and /readyz probes
})
export class AppModule {}
