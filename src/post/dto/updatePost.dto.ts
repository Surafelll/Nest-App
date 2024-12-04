// import { PartialType } from '@nestjs/mapped-types'

import { PartialType } from '@nestjs/swagger'
import PostDto from './createPost.dto'

export default class UpdatePostDto extends PartialType(PostDto) {}
