import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsUrl,
  IsInt,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty() @MaxLength(2000) content: string;
  @IsOptional() @IsUrl() imageUrl?: string;
}
