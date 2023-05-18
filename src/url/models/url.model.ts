import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  longUrl: string;

  @Prop({ required: true })
  shortUrl: string;

  @Prop({ required: true })
  shortId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: 0 })
  count: number;
}

export const shortUrlSchema = SchemaFactory.createForClass(Url);
shortUrlSchema.index({ shortId: 1, longUrl: 1 });
