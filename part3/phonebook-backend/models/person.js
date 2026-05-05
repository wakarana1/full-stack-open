const { ReturnDocument } = require('mongodb')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
// const url = process.env.MONGODB_URI
const url = `mongodb+srv://wuchristophert_db_user:${password}@cluster0.xwjc6mm.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  }
)

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    minLength: 3,
    required: true,
    validate: {
      validator: function(v) {
        return /^(\d{2}-\d{5,}|\d{3}-\d{4,})$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
  