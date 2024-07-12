import { ApiResponseProperty } from '@nestjs/swagger'
import { EnumVm } from './enum.vm'
import { Profile, ProfileVm } from 'src/commons/enums/profile.enum'

export class UserVm {
  @ApiResponseProperty()
  id: string

  @ApiResponseProperty()
  email: string

  @ApiResponseProperty()
  firstname: string

  @ApiResponseProperty()
  lastname: string

  @ApiResponseProperty()
  contact: string

  @ApiResponseProperty()
  profile: EnumVm<Profile, ProfileVm>

  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.contact = data.contact
    this.profile = data.profile ? new EnumVm(data.profile, Profile, ProfileVm) : null
  }
}

export class UserMinVm {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  firstname: string;

  @ApiResponseProperty()
  lastname: string;

  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
  }
}
