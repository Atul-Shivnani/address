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

app.listen(3001, () => {
    console.log("Server started on port 3001");
});