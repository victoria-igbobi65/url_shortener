import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class RequestInfo extends Document {
  @ApiProperty()
  @Prop({ required: true })
  ip: string;

  @ApiProperty()
  @Prop({ required: true })
  agent: string;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  url_id: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
export const RequestInfoschema = SchemaFactory.createForClass(RequestInfo);
RequestInfoschema.index({ url_id: 1 });
