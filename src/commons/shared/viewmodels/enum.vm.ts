import { IsString } from 'class-validator';

export class EnumVm<T, U> {

  @IsString()
  default: string;

  @IsString()
  view: string;

  constructor(value: string, enumType: T, enumVmType: U) {
    this.default = enumType[value];
    this.view = enumVmType[value] ?? this.default;
  }
}
