import { ApiProperty } from '@nestjs/swagger'

export default class CreatedPost {

  @ApiProperty({
    description: 'Post title',
    example: 'Post title',
  })
  text: string
  @ApiProperty({
    description: 'Post text',
    example: 'Post text',
  })
  authorId: number

  @ApiProperty({
    description: 'Post text',
    example: 'Post text',
  })
  id: number
  @ApiProperty({
  })
  title: string

  @ApiProperty({
  })
  Description: string

  @ApiProperty({
  })
  hashtag:string

  @ApiProperty({
  })
  rating: string

  @ApiProperty({
  })
  updatedAt: Date
  @ApiProperty({
  })
  createdAt: Date
}
