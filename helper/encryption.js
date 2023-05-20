const bcrypt = require('bcrypt');

// Get password hash with salt
const getEncryptedPasswordWithSalt = (password) => {
    let salt = bcrypt.genSaltSync(10);
    let passwordHashWithSalt = bcrypt.hashSync(password, salt);
    let passwordHash = passwordHashWithSalt.substring(29);
    return {
        password: passwordHash,
        salt: salt
    };
};

module.exports = {
    getEncryptedPasswordWithSalt: getEncryptedPasswordWithSalt
};