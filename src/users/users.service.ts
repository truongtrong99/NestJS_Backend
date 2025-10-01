import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  hashPassword(password: string): string {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);
    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `This action returns a #${id} user`;
    }
    const user = this.userModel.findOne({
      _id: id
    });
    return user;
  }

  findOneByUserName(username: string) {
    const user = this.userModel.findOne({
      email: username
    });
    return user;
  }

  isValidPassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
    return user;
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `This action returns a #${id} user`;
    }
    const user = this.userModel.deleteOne({
      _id: id
    });
    return user;
  }
}
