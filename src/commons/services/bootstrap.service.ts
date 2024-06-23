import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
  ) {}

  async onApplicationBootstrap() {}
}
