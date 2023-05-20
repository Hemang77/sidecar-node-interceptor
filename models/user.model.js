const bcrypt = require('bcryptjs');
const constant = require('../config/constant');
const jwt = require('jsonwebtoken');
const dateFormat = require('../helper/dateformat.helper');
const { jwtAuthSecret, jwtRefreshSecret } = require('../config/keys');
const encryption = require('../helper/encryption');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Number,
        required: true,
        default: false
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
    token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: Number,
    },
    age: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    salt: {
        type: String
    },
    otp: {
        type: Number
    },
    profilePic: {
        type: String
    },
    sociaId: {
        type: String
    },
    userStatus: {
        type: String
    }
},
    {
        collection: 'users'
    }
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (this.password && this.isModified('password')) {
        let enc = encryption.getEncryptedPasswordWithSalt(user.password);
        user.password = enc.password;
        user.salt = enc.salt;
    }
    next();
});

//checking if password is valid
userSchema.methods.validPassword = function (password) {
    let hashWithSalt = bcrypt.hashSync(password, this.salt).substring(29);
    return (hashWithSalt === password) ? true : false;
};


// find user by credentials 
userSchema.statics.findByCredential = async (userName, password) => {
    // find user in db
    const user = await User.findOne({
        userName: userName,
        status: { $ne: constant.status.DELETE }
    });
    if (!user) {
        let anotherUser = await User.findOne({
            email: userName,
            status: { $ne: constant.status.DELETE }
        });
        if (anotherUser) {
            if (!anotherUser.isVerified) {
                throw new Error('Please Verify your Email before loging in.');
            } else {
                // compare passwords
                let hashWithSalt = bcrypt.hashSync(password, anotherUser.salt).substring(29);
                if (!(hashWithSalt === anotherUser.password)) {
                    throw new Error('Please enter correct Password');
                }
                delete anotherUser.password;
                delete anotherUser.salt;
                return anotherUser;
            }
        } else {
            throw new Error('Enter Correct Email or Username');
        }
    } else {
        if (!user.isVerified) {
            throw new Error('Please Verify your Email before loging in.');
        } else {
            // compare passwords
            let hashWithSalt = bcrypt.hashSync(password, user.salt).substring(29);
            if (!(hashWithSalt === user.password)) {
                throw new Error('Please enter correct Password');
            }
            delete user.password;
            delete user.salt;
            return user;
        }
    }
}

//Generating auth token
userSchema.methods.generateAuthToken = async function () {
    let user = this;
    let token = await jwt.sign({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        deletedAt: user.deletedAt
    }, jwtAuthSecret, {
        expiresIn: constant.authentication.authTokenExpiry
    })
    user.token = token
    user.updatedAt = await dateFormat.set_current_timestamp();
    user.tokenExpiry = await dateFormat.add_time_to_current_timestamp(1, 'days')
    await user.save()
    return {
        token,
        tokenExpiry: user.tokenExpiry
    }
};

userSchema.methods.generateRefreshToken = async function () {
    let user = this;
    let refresh_token = await jwt.sign({
        _id: user._id.toString()
    }, jwtRefreshSecret, {
        expiresIn: constant.authentication.refreshTokenExpiry
    })
    user.refresh_token = refresh_token
    user.updated_at = await dateFormat.set_current_timestamp();
    await user.save()
    return refresh_token
}

// // to send minimal objects
// userSchema.methods.toJSON = () => {
//     const user = this;
//     const userObj = user.toObject();
//     delete userObj.token;
//     delete userObj.password;
//     delete userObj.__v;
//     return userObj;
// }

userSchema.index({ "userName": 1 });
userSchema.index({ "email": 1 });
userSchema.index({ "mobileNumber": 1 });
userSchema.index({ "status": 1 });

const User = mongoose.model('users', userSchema);
module.exports = User;