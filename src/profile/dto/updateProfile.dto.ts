import { PartialType } from '@nestjs/swagger'
import ProfileDto from './createProfile.dto'

export default class UpdateProfileDto extends PartialType(ProfileDto) {}
