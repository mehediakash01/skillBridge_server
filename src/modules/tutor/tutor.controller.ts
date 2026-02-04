import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync.js"
import sendResponse from "../../utils/sendResponse.js"
import { tutorService } from "./tutor.service.js"


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


export const tutorController = {
    createTutor
}