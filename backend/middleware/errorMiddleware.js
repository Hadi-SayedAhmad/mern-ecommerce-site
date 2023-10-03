const notFound = (req, res, next) => { //this will be called if we are going to routes that we don't have
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

//to overrride the default behavior:

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // check if it's a bad ObjectId
    if (err.name === "CastError" && err.kind === "ObjectId") {
        message = `Resource not found`;
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? "BURGER" : err.stack
    })
}

export { notFound, errorHandler }

