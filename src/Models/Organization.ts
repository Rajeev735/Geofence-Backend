import mongoose,{Schema,Document} from "mongoose";


export interface IOrganization extends Document{
   
  org:string,
  email:string,
  country:string,
  state:string
}

const OrgSchema= new Schema<IOrganization>({
  org:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  country:{type:String,required:true},
  state:{type:String,required:true}
},
{timestamps:true}

);

export default mongoose.model<IOrganization>("Organization",OrgSchema)