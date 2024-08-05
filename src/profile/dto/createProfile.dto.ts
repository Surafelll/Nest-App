import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export default class ProfileDto {
  @ApiProperty({
    description: 'The image URL of the user',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  image: string

  @ApiProperty({
    description: 'The location of the user',
    example: 'New York, USA',
  })
  @IsString()
  location: string

  @ApiProperty({
    description: 'The biography of the user',
    example: 'Passionate about technology and innovation',
  })
  @IsString()
  bio: string


  @ApiProperty({
    description: 'nick name',
    example: 'surafel -> sura',
  })
  @IsString()
  nickname: string

  @ApiProperty({
    description: 'Your post impersion about',
    example: 'music dance religion.....',
  })
  @IsString()
  category: string


  @ApiProperty({
    description: 'The user ID associated with the profile',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  userId: string
}
