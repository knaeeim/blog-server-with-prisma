import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Admin1",
            email: "admin1@gmail.com",
            password: "admin123",
            role: UserRole.ADMIN
        }

        // Now chekcing the user is exists or not
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        // if exists then throw a error
        if (existingAdmin) {
            throw new Error("Admin user already exists");
        }

        // if not exists then create a new admin user
        const newAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        if(newAdmin.ok){
            const updateAdmin = await prisma.user.update({
                where : {
                    email : adminData.email
                }, 
                data : {
                    emailVerified : true
                }
            })
            console.log("Admin user created successfully:", updateAdmin);
        }

    } catch (error: any) {
        console.error("Error seeding admin user:", error.message);
    }
}

seedAdmin();