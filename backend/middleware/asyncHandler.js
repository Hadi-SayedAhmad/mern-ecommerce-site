const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next); //next is used to pass control to the next middleware function in the request-response cycle.
    }
} 
//this asyncHandler function is higher order where it takes functions as parameter like .map, and return a function... here its taking some function as parameter, and returning a function which will execute the function in the parameter inside a promise/catch or try/catch ... if the promise resolved it will move to the next middleware, otherwise error will be catched and jump into a custom error handler!

export default asyncHandler;