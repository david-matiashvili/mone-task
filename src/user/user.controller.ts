import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { SearchUsersDto } from './dto/search_user.dto'
import { SuccessResponse } from 'src/common/dto/response.dto';
import { Request } from 'express';
import { UserCheckPipe } from './pipes/user_check.pipe';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('')
  async serachUsers(@Req() request: Request, @Query() data: SearchUsersDto) {
    const user = request['user'];

    const rows = await this.userService.serachUsers(data, user.id);
    return new SuccessResponse("Done!", rows);
  }

  @Post('friendRequest/:id')
  async makeFriendRequest(@Req() request: Request, @Param('id', ParseIntPipe, UserCheckPipe) id: number) {
    const user = request['user'];

    await this.userService.makeFriendRequest(user.id, id);

    return new SuccessResponse("Request created!");
  }

  @Get('friendRequests')
  async getFriendRequests(@Req() request: Request) {
    const user = request['user'];

    const result = await this.userService.getFriendRequests(user.id);

    return new SuccessResponse("All freind requests", result);
  }

  @Post('friendRequest/:requestId/accept')
  async acceptFriendRequest(@Req() request: Request, @Param('requestId', ParseIntPipe) requestId: number) {
    const user = request['user'];
    
    await this.userService.acceptFriendRequest(requestId, user.id);

    return new SuccessResponse("Friend request accepted")
  }

  @Post('friendRequest/:requestId/decline')
  async declineFriendRequest(@Req() request: Request, @Param('requestId', ParseIntPipe) requestId: number) {
    const user = request['user'];
    
    await this.userService.declineFriendRequest(requestId, user.id);

    return new SuccessResponse("Friend reuqest declined")
  }


}
