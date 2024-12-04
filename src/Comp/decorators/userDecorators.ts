import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('User not found in request');
    }
    if (data) {
      return {
        ...request.user,
        additionalData: data,
      };
    }
    return request.user;
  },
);
export default UserDecorator;
