import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('test/:id')
  getHello(@Param('id', ParseIntPipe) id: number): string {
    if (id < 1) {
      throw new BadRequestException('Id should be more than 1');
    }

    return this.appService.getHello(id);
  }
}
