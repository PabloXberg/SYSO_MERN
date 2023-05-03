import bcrypt from "bcrypt";

const encryptPassword = async (password) => {
    try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword
  } catch(error) {
        console.log("Error: ", error);
        alert("Something went wrong" , error)
  }
}

const verifyPassword = async (password, hashedPassword) => {
  const verified = bcrypt.compare(password, hashedPassword);
  return verified;
};

export {encryptPassword, verifyPassword }