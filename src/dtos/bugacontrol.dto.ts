import { IsBoolean, IsDefined, IsEmail, Max, Min } from 'class-validator';

export class IgniteDTO {

  @IsBoolean()
  public on: boolean;
}

export class MoveDTO {
  @Min(-1000)
  @Max(1000)
  public joint_a = 0;

  @Min(-1000)
  @Max(1000)
  public joint_b = 0;

  @Min(-1000)
  @Max(1000)
  public joint_c = 0;

  @Min(-1000)
  @Max(1000)
  public vertical_axis = 0;
}
