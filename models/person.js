const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//define the Person Schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager', 'HR'],
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
personSchema.pre('save', async function (next) {
    const person = this;
    //hash the password only if it is not present in database
    if (!person.isModified('password'))
        return next();
    try {
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

personSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (error) {
        throw error;
    }
}
//create Person Model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;