import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class PostDto {
  @ApiProperty({
    description: 'The Title Of The Post',
    example: 'Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;


  @ApiProperty({
  description: 'Description of the post',
  example: 'My first post',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  
  @ApiProperty({
    description: 'ID of the owner of the post',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'Detail Decription about post',
    example: 'my first post',
  })
  @IsString()
  Description: string;

  @ApiProperty({
    description: 'hashtag',
    example: '#computer',
  })
  @IsString()
  Hashtag: string;

  @ApiProperty({
    description: 'rating',
    example: 'give rating for current post',
  })
  @IsString()
  rating: string;
}