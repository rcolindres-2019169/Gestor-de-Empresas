import {Schema, model} from "mongoose";

const companySchema = Schema({
    name:{
        type: String,
        required: true
    },
    years: {
        type: String,
        required: true    
    },
    impactLevel:{
        type: String,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
}, {
    versionKey: false

})

export default model('company', companySchema)