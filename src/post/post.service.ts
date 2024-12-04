import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';
import PostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import CustomErrorException from 'src/Comp/Erorr/CustomErrorException';


@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(dto: PostDto) {
    try {
      return await this.prisma.post.create({
        data: {
          text: dto.text,
          title: dto.title,
          rating: dto.rating,
          Description: dto.Description,
          Hashtag: dto.hashtags,
          author: {
            connect: { id: Number(dto.authorId) },
          },
        },
      });
    } catch (error) {
      CustomErrorException.handle(error, 'Create Post');
    }
  }

  async getAllPosts() {
    try {
      const allPosts = await this.prisma.post.findMany({
        where: { deletedAt: null },
      });

      if (allPosts.length === 0) {
        throw new CustomErrorException('No posts found', 404, 'Get All Posts');
      }

      return allPosts;
    } catch (error) {
      CustomErrorException.handle(error, 'Get All Posts');
    }
  }

  async deletePost(postId: number, incomingId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });

      if (!post) {
        throw new CustomErrorException('Post not found', 404, 'Delete Post');
      }

      if (post.author.id !== incomingId) {
        throw new CustomErrorException('You are forbidden to delete this post', 403, 'Delete Post');
      }

      await this.prisma.post.delete({ where: { id: postId } });
      return { message: 'Post deleted successfully' };
    } catch (error) {
      CustomErrorException.handle(error, 'Delete Post');
    }
  }

  async updatePost(postId: number, dto: UpdatePostDto, incomingId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });

      if (!post) {
        throw new CustomErrorException('Post not found', 404, 'Update Post');
      }

      if (post.author.id !== incomingId) {
        throw new CustomErrorException('You are not authorized to update this post', 401, 'Update Post');
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
          rating: updateData.rating,
          Description: updateData.Description,
          Hashtag: updateData.hashtags,
        },
      });
    } catch (error) {
      CustomErrorException.handle(error, 'Update Post');
    }
  }
}
