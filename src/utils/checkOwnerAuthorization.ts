import { UnauthorizedException } from '@nestjs/common';

export default (userId: number, dedicatedUserId: number) => {
  if (userId !== dedicatedUserId)
    throw new UnauthorizedException('You are not authorized');
};
