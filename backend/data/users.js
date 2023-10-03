import bcrypt from "bcryptjs";

const users = [
    {
        name: "Ahmoudi l fos",
        email: "admin@email.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: true,
    },
    {
        name: "user",
        email: "admin2@email.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: false,
    },
    {
        name: "Hadi l malek",
        email: "admin3@email.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: true,
    },
]

export default users;