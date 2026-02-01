
import app from "./lib/app.js";
import { prisma } from "./lib/prisma.js"
 const PORT = process.env.PORT || 3000
const main = async ()=>{
   
    try{
    await prisma.$connect()
    console.log("connected to database successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })

    }
    catch(error)
    {

console.log("An error occurred",error);
prisma.$disconnect()
process.exit(1)
    }

}

main();