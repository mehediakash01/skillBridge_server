import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync.js"
import sendResponse from "../../utils/sendResponse.js"
import { tutorService } from "./tutor.service.js"

// create tutor profile
const createTutor = catchAsync(
    async(req:Request,res:Response)=>{
        const user = req.user;
        if (!user){
             throw new Error("User not authenticated");
        }
        const {id} = user;

const tutorProfile = await tutorService.createOrUpdateUser(
    
    id as string,
    req.body,
)

sendResponse(res,{
    statusCode:201,
    success: true,
      message: "Tutor profile created successfully",
      data: tutorProfile
})
}

)
// get tutor profile
const getMyProfile = catchAsync(
    async(req:Request,res:Response)=>{
        const user = req.user;
        if (!user){
             throw new Error("User not authenticated");
        }
        const {id} = user;

     const result = await tutorService.getTutorProfileById(id)
     sendResponse(res,{
        statusCode:200,
        success:true,
        message:"successfully retrieved profile information",
        data:result
     })
    }
)

// update tutors availability

const updateTutorAvailability = catchAsync(

    async(req:Request,res:Response)=>{

        const user = req.user;
        const {slots} = req.body;
        if (!user){
             throw new Error("User not authenticated");
        }
        const {id} = user;
        const result = await tutorService.updateTutorAvailability( id,slots)

        sendResponse(res,{
            success:true,
            statusCode:200,
            message:"tutor set up availability successful",
            data:result
        })
    }
)

export const tutorController = {
    createTutor, getMyProfile,updateTutorAvailability
}