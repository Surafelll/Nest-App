import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export default class ProfileDto {
  @ApiProperty({
    description: 'The image URL of the user',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  username: string

  @ApiProperty({
    description: 'emali',
    example: 'sura@gmail.com',
  })
  @IsNotEmpty()
  
  @IsString()
  email: string

  @ApiProperty({
    description: 'password',
    example: 'make it complicated',
  })
  @IsString()
  password: string


  @ApiProperty({
    description: 'Fullname',
    example: 'surafel',
  })

  @IsString()
  fullname: string

  @ApiProperty({
    description: 'your name',
    example: 'surafel',
  })
  @IsNotEmpty()
  @IsString()
  First_name: string


  @ApiProperty({
    description: 'Your father name',
    example: 'dad',
  })
  
  @IsString()
  Last_name: string
}
