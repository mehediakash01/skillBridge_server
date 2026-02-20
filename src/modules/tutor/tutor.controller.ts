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
// get all tutors
const getAllTutors = catchAsync(async (req, res) => {
  const result = await tutorService.getAllTutors(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "retrieve all tutor successfully",
    data: result,
  })
})

// get  tutors by id
const getTutorById = catchAsync(async(req:Request,res:Response)=>{
    const tutorId = req.params!.id;
  
    if (!tutorId){
        throw new Error("TutorId is missing")
    }
    const result = await tutorService.getTutorByID(tutorId as string)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"retrieve  tutor details successfully",
        data:result
    })
})


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

// get tutors own availability
export const getMyAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const tutorUserId = req.user!.id;

    const result = await tutorService.getTutorAvailability(tutorUserId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Availability fetched successfully",
      data: result,
    });
  }
);

export const tutorController = {
    createTutor, getMyProfile,updateTutorAvailability,
    getMyAvailability,
    getAllTutors,
    getTutorById
}