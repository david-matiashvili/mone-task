import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class UserCheckPipe implements PipeTransform {
    constructor(private readonly userService: UserService) { }

    async transform(id: number) {
        const user = await this.userService.findById(id);
        if (!user) throw new BadRequestException("User not found!");

        return id;
    }
}