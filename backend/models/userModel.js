const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required:true,
  }
},{timestamps:true})

userSchema.statics.signup = async function(email,password){
  if(!email || !password){
    throw Error('All fields must be filled.')
  }
  
  if(!validator.isEmail(email)){
    throw Error('This is not a valid email.')
  }

  if(!validator.isStrongPassword(password)){
    throw Error('You mus use a strong password.')
  }

  const exist = await this.findOne({email})
  
  if(exist){
    throw Error('Email already in use.')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password,salt)

  const user = await this.create({email,password:hash})

  return user
}

userSchema.statics.login = async function(email,password){
  if(!email || !password){
    throw Error('All the fields must be fill in.')
  }

  if(!validator.isEmail(email)){
    throw Error('This is not a valid email.')
  }

  const user = await this.findOne({email})

  if(!user){
    throw Error('Incorrect email.')
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User',userSchema)