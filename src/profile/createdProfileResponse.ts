import { ApiProperty } from '@nestjs/swagger'

export default class CreatedProfile {
  @ApiProperty()
  id: string

  @ApiProperty()
  image: string

  @ApiProperty()
  bio: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  location: string

  @ApiProperty()
  nickname: string

  @ApiProperty()
  category: string

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  createdAt: Date
}
