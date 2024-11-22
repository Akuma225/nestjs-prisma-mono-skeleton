import { SetMetadata } from '@nestjs/common';
import { Profile } from '../enums/profile.enum';

export const SetProfile = (...profiles: Array<Profile>) =>
  SetMetadata('profiles', profiles);
