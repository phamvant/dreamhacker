import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prisma.user.create({
      data: { ...dto, password: await hash(dto.password, 10) },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = newUser;
    return res;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) return user;
    throw new NotFoundException();
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = user;
      return res;
    }

    throw new NotFoundException();
  }
}
