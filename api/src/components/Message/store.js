const { message } = require('../../models/Message')
const { User } = require('../../models/User')

const createMessageDB = async (content, Converseid, sender) => {
    try{
      const mensaje = new message({content, Converseid, sender})
      await mensaje.save()
      return mensaje
    }catch(err){
      throw new Error(err.message)
    }
}

const findMessagesDB = async (converseid) => {
  try{
    const mensajes = await message.find({Converseid: converseid});
    if(mensajes){
    return mensajes}
    else{
      throw new Error('No existe el mensaje')
    }
  }
  catch(err){
    return err.message
  }
}

const findAndUpdateDB = async (idMessage) => {
  try{
    const mess = await message.findByIdAndUpdate({_id:idMessage}, {state: 'read'})
    return mess;
  }
  catch(err){
    return err.message
  }
}

const mailNotificator = async (ReceiverId) => {
  try{
    let user = await User.findById({_id:ReceiverId})
    return user
  }catch(err){
    return err.message
  }
}

module.exports = {
  createMessageDB,
  findMessagesDB,
  findAndUpdateDB,
  mailNotificator
}