import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job',
        required : true
    },
    applicant :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type : String,
        enum:['pending','accepted','rejected'],
        default : "pending"
    },
    aiEvaluation: {
        score: { type: Number },
        recommendation: {
            type: String,
            enum: ['strong_hire', 'hire', 'possible_fit', 'not_recommended']
        },
        strengths: [{ type: String }],
        missingSkills: [{ type: String }],
        summaryReasoning: { type: String },
        evaluatedAt: { type: Date }
    }

},{timestamps:true});

export const Application = mongoose.model("Application",applicationSchema);