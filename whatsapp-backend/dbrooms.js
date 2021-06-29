import mongoose from 'mongoose'

// Creating data structures for storing rooms
const wpSchema2 = mongoose.Schema({
    name: String,
    image: String
})


export default mongoose.model('rooms',wpSchema2)