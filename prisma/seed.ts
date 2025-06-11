import { PrismaClient } from "@prisma/client";

    const prisma = new PrismaClient()
async function init() {
    try {
        const user = await prisma.user.create({
            data: {
                username: "",
                password: "",
                email: "",
            }

        })
        console.log(user);
    }
    catch (e) {
        console.log("Server error");
    }
}
// init()

async function Post() {
    const post = await prisma.post.createMany({
        data:{
            
        }

    })
    console.log(post);
}
Post()
async function get() {
    try{
    const get = await prisma.post.findFirst({
        where:{
            author_id:2
            
        }
    })
    if(get==null){console.log(({
        message:"not found",
        status:404
    }.status

    
))

    }
}
catch(e){
    console.log(JSON.parse({
        message:"not found",
        status:404
    }.message))
}
}




