import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  longUrl: string;

  @Prop({ required: true })
  shortUrl: string;

  @Prop({ required: true })
  shortId: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: 0 })
  count: number;
}

export const shortUrlSchema = SchemaFactory.createForClass(Url);
shortUrlSchema.index({ shortId: 1, longUrl: 1 });
