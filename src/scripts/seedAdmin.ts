
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../middlewares/authMiddleware.js";

const seedAdmin =async ()=>{
    try{
        console.log("****Admin is seeding****");
        const AdminData = {
            name: process.env.ADMIN_NAME,
            email:process.env.ADMIN_EMAIL ,
            password: process.env.ADMIN_PASSWORD,
            role: UserRole.ADMIN
        }
        if (!AdminData.email) {
  throw new Error("Email is required")
}
 console.log("****checking user existence****");
        const existingUser = await prisma.user.findUnique({
            
            where:{
                email:AdminData.email
            }
        })
        if (existingUser){
            throw new Error("User already exists");
        }

        const signUpAdmin =await fetch("http://localhost:3000/api/auth/sign-up/email",{


            method:"POST",
            headers:{
                "Content-Type":"application/json",
                 "Origin": "http://localhost:3000"
            },
            body:JSON.stringify(AdminData)

            
        })
        console.log( await signUpAdmin.json());
         if (signUpAdmin.ok){
             console.log("****Admin Created****");
            await prisma.user.update({
                where:{
                    email:AdminData.email
                },
                data:{
                 emailVerified: true
                }
            })
             console.log("****Email verification status updated****");
        }
         console.log("****Success****");
       

    }
    catch(err){
        console.log(err);
    }

}

seedAdmin();