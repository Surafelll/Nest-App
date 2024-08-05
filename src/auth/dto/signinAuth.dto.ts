// import { PartialType } from '@nestjs/mapped-types'
import {  PartialType } from '@nestjs/swagger'
import { OmitType } from '@nestjs/mapped-types'
import AuthDto from './signupAuth.dto'


export default class UpdateAuthDto extends PartialType(
  OmitType(AuthDto, ['fullname', 'email'] as const),
) {
  email: any
}
