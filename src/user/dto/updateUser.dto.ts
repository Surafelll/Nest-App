// import { PartialType } from '@nestjs/mapped-types'

import { PartialType } from '@nestjs/swagger'


import CreatedUser from '../createdUserResponse'


export default class UpdateUserDto extends PartialType(CreatedUser) {}
