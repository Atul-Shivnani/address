const express = require("express");
const { PrismaClient } = require('@prisma/client');
const {userSchema, addressSchema} = require ("./schemas")
const cors = require ('cors')

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors())

app.post("/submission", async (req, res) => {
    const { userData, addressData } = req.body;
    const parsedUserData = userSchema.safeParse(userData)
    const parsedAddressData = addressSchema.safeParse(addressData)

    if (!parsedAddressData.success || !parsedUserData.success) {
        return res.status(400).json({
            state: "error",
            msg: "Validation error! Please check the data entered",
            errors: {
                userData: parsedUserData.error?.errors,
                addressData: parsedAddressData.error?.errors
            }
        });
    }

    try {
        const existing = await prisma.user.findFirst({
            where: {
                email: userData.email
            }
        });

        if (existing) {
            const newAddress = await prisma.address.create({
                data: {
                    ...addressData,
                    user: { connect: { id: existing.id } }
                },
                include: { user: true }
            });
            console.log("User already exists, new address added");
            res.json({
                state: "partial",
                msg: "User already exists, new address added",
                address: newAddress
            });
        } else {
            const newUser = await prisma.user.create({
                data: {
                    ...userData,
                    address: {
                        create: addressData
                    }
                },
                include: {
                    address: true
                }
            });
            console.log("Added user and address successfully");
            res.json({
                state: "complete",
                msg: "User and address added successfully to the database",
                user: newUser
            });
        }
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({
            state: "error",
            msg: `DB/Server error: ${e.message}`
        });
    }
});

app.get("/users", async (req, res)=>{
    const users = await prisma.user.findMany()
    console.log(users)
    res.send(users)
})

app.get("/user/:id",async (req, res)=>{
    const id = parseInt(req.params.id, 10);
    const user = await prisma.user.findUnique({
        where:{
            id:id
        },
        include:{
            address:true
        }
    })
    res.send(user)
})

app.delete("/delete/:id",async (req, res)=>{
    const id = parseInt(req.params.id, 10);
    try{
        const response = await prisma.user.delete({
            where:{
                id:id
            }
        })
        res.json({
            state: "Deleted Successfully",
            msg: "User and address deleted successfully from the database",
        });
    }catch(e){
        console.error("Error:", e);
            res.status(500).json({
                state: "error",
                msg: `DB/Server error: ${e.message}`
            });
    }
  
})

app.put("/user/:id", async (req, res) => {
    const { userData, addressData } = req.body;
    const id = parseInt(req.params.id, 10);
    console.log("id: "+id +" userdata: "+userData+" address: "+addressData)
    try {
        // Use a transaction to update both the user and address
        const response = await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    // Directly assign the fields of the user
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    // Add any other user fields here
                },
            }),
            prisma.address.update({
                where: {
                    id: addressData.id, // Assuming userId is the foreign key in the address table
                },
                data: {
                    // Directly assign the fields of the address
                    address1: addressData.address1,
                    address2: addressData.address2,
                    city: addressData.city,
                    state: addressData.state,
                    zip: addressData.zip,
                },
            }),
        ]);

        res.json({
            state: "Updated",
            msg: "User and address details updated successfully",
            updatedData: response,
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({
            state: "error",
            msg: `DB/Server error: ${e.message}`,
        });
    }
});


app.listen(3001, () => {
    console.log("Server started on port 3001");
});