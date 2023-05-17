import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RequestInfo extends Document {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  agent: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  url_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
export const RequestInfoschema = SchemaFactory.createForClass(RequestInfo);
RequestInfoschema.index({ url_id: 1 });
