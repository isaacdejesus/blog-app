const logger = require('./logger.js')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
 //middleware called in order declared
//defines a middleware function
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}
//last middleware in chain. Handles failed requests
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({
            error: "invalid token"
        })
    }
    else if(error.name === 'TokenExpiredError'){
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}
   
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    //return authorization.substring(7)
    request.token = authorization.substring(7)
  }
  //return null
  next()
}

const userExtractor = async(request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    //request.token = authorization.substring(7)
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }
  //return null
  next()
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler, 
    tokenExtractor,
    userExtractor
}
