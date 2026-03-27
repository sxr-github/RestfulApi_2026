class Apierror extends error {
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest (message = "Bad request"){
        return new Apierror(400, message)
    }

    static unauthorized(message = "Unauthorized"){
        return new Apierror(403, message)
    }

    static conflict(message = "Conflict"){
        return new Apierror(404, message)
    }

}


export default Apierror