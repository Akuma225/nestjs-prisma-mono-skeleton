import { INestApplication, Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class LifecycleService implements OnModuleDestroy {
  constructor(private app: INestApplication) {}

  beforeExitHandler() {
    process.on('beforeExit', async () => {
      await this.app.close();
    });
  }

  async onModuleDestroy() {
    await this.app.close();
  }
}
