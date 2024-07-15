import { ApiResponseProperty } from '@nestjs/swagger'
import { EnumVm } from './enum.vm'
import { Profile, ProfileVm } from 'src/commons/enums/profile.enum'
import { BaseVm } from './base.vm'

export class UserVm extends BaseVm {
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
    super(data)
    this.id = data.id
    this.email = data.email
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.contact = data.contact
    this.profile = data.profile ? new EnumVm(data.profile, Profile, ProfileVm) : null
  }
}

