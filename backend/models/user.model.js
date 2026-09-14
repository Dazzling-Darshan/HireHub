import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    phoneNumber :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    role:{
        type : String,
        enum :['student','recruiter'],
        required : true
    },
    profile:{
        bio:{type : String},
        skills : [{type : String}],
        resume : {type : String}, //url of resume
        resumeOriginalName : {type : String},
        company : {type : mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto :{
            type : String,
            default :""
        },
        parsedResume: {
            extractedAt: { type: Date },
            summary: { type: String },
            education: [{
                degree: { type: String },
                institution: { type: String },
                year: { type: String }
            }],
            experience: [{
                role: { type: String },
                company: { type: String },
                duration: { type: String },
                highlights: [{ type: String }]
            }],
            projects: [{
                title: { type: String },
                description: { type: String },
                techStack: [{ type: String }]
            }],
            rawSkills: [{ type: String }]
        },
        resumeEmbedding: {
            type: [Number],
            default: undefined,
            select: false
        }
    },

}, { timestamps : true});

export const User = mongoose.model("User",userSchema);