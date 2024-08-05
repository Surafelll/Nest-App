import { ApiProperty } from '@nestjs/swagger'
import { StartsWithHash } from 'src/Comp/decorators/starts-with-hash.decorator';
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
  @StartsWithHash()
  Hashtag:string

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
