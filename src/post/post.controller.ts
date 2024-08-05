import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserDecorator } from 'src/Comp/decorators/userDecorators';

import { PostService } from './post.service';
import CreatedPost from './createdPostResponse';
import PostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiCreatedResponse({ type: CreatedPost })
  createPost(@Body() dto: PostDto) {
    return this.postService.createPost(dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Post deleted successfully.' })
  async deletePost(@Param('id', ParseIntPipe) id: number, @UserDecorator() user: any) {
    return this.postService.deletePost(id, user.sub);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreatedPost })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @UserDecorator() user: any,
  ) {
    return this.postService.updatePost(id, dto, user.sub);
  }

  @Get()
  @ApiOkResponse({ type: [CreatedPost] })
  async getAllPosts() {
    return this.postService.getAllPosts();
  }
}