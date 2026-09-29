const mogoose = require('mongoose');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

const userSchema = mogoose.Schema({
    username:{
        type:String, 
        required :[true, "username is required."],
        unique: true,
        trim: true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        match:[/.+@.+\..+/, "Please provide a vslid email address"]
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[7,"Password must ne at least 7 char long"],
        trim : true,
    },
    role:{
        type:String,
        enum : ['user', 'admin'],
        default : "user"
    },
    },{
        timestamp:true
    }
);

userSchema.pre("save", async function(){
    if (this.isNew || this.isModified("password")){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password , saltRounds);
    }
})
userSchema.methods.isCorrectPassword = function(password){
    return bcrypt.compare(password, this.password);
}

const User = new mongoose.model('User', userSchema);

module.exports = User;
