import { IsNumber, IsNotEmpty } from 'class-validator';

export class SetRoleDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}
