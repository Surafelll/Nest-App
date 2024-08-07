import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';
import PostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(dto: PostDto) {
    try {
      return await this.prisma.post.create({
        data: {
          
          text: dto.text,
          title: dto.title,
          rating:dto.rating,
          Description:dto.Description,
          Hashtag: dto.hashtags,
          
          author: {
            connect: { id: Number(dto.authorId) },
          },
        },
      });
    } catch (error) {
      throw new Error('An error occurred while creating the post');
    }
  }

  async getAllPosts() {
    const allPosts = await this.prisma.post.findMany({
      // where : {deletedAt :null }
    });

    if (allPosts.length === 0) {
      throw new NotFoundException('No posts found');
    }

    return allPosts;
  }

  async deletePost(postId: number, incomingId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });
  
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    if (post.author.id !== incomingId) {
      throw new ForbiddenException('You are forbidden to delete this post');
    }
  
    await this.prisma.post.delete({ where: { id: postId } });
    return { message: 'Post deleted successfully' };
  }

  async updatePost(postId: number, dto: UpdatePostDto, incomingId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== incomingId) {
      throw new UnauthorizedException('You are not authorized to update this post');
    }

    const updateData: Partial<UpdatePostDto> = {};

    if (dto.title) {
      updateData.title = dto.title;
    }
    if (dto.text) {
      updateData.text = dto.text;
    }
    if (dto.rating) {
      updateData.rating = dto.rating;
    }
    if (dto.Description) {
      updateData.Description = dto.Description;
    }
    if (dto.hashtags) {
      updateData.hashtags = dto.hashtags;
    }
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: updateData.title,
        text: updateData.text,
      },
    });
  }
}