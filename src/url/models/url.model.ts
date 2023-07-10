import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Url extends Document {
  @ApiProperty()
  @Prop({ required: true })
  longUrl: string;

  @ApiProperty()
  @Prop({ default: null })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  shortUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  shortId: string;

  @ApiProperty()
  @Prop({ default: null })
  qrlink: string;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: 0 })
  count: number;
}

export const shortUrlSchema = SchemaFactory.createForClass(Url);
shortUrlSchema.index({ shortId: 1, longUrl: 1 });
