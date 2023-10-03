import  jwt  from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    //we don't need to store this token in client side, but we will store it on http-only cookie
    res.cookie("jwt", token, { //this will send a cookie to the client containing the token 
        httpOnly: true, // because by default the document frontend can access cookies which we don't want!
        secure: process.env.NODE_ENV !== "development",
        nameSite: "strict", //like if we went to another site different from our domain, we don't need to send the token with the request
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    });

    
}

export default generateToken;