const { model } = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { UserModel } = require("../model/userModel");

const userRegister = async (req, res) => {
  // console.log(req.body)
  try {
    const { first_name, last_name, email, mobile, password, role, status } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !mobile ||
      !password ||
      !role ||
      !status
    ) {
      return res
        .status(501)
        .json({ message: "Please Provide all the details" });
    }

    const alreadypresent = await UserModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (alreadypresent)
      return res
        .status(501)
        .json({ message: "Either email or mobile number Already present " });

    const alreadyMOB = await UserModel.findOne({ mobile });

    if (alreadyMOB)
      return res
        .status(501)
        .json({ message: "Mobile number is already registered" });

    if (mobile.length !== 10) {
      return res
        .status(501)
        .json({ message: "Mobile should be 10 characters long" });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      return res.status(501).json({
        message:
          "minimum 8 characters, one capital letter, and one special character",
      });
    }

    const hashpass = bcrypt.hashSync(password, 8);

    const userdata = new UserModel({
      first_name,
      last_name,
      email,
      mobile,
      password: hashpass,
      role,
      status,
    });

    await userdata.save();
    res.status(200).json({ message: "Account successfully created" });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const isuser = await UserModel.findOne({ email });
    if (!isuser)
      return res
        .status(501)
        .json({ message: "Register First! Email not register" });

    if (isuser.role !== role) {
      return res.status(501).json({ message: "Role mismatch" });
    }
    const checkpass = bcrypt.compareSync(password, isuser.password);
    if (!checkpass)
      return res.status(501).json({ message: "Password is not correct" });

    const token = jwt.sign(
      { userId: isuser._id, role },
      process.env.secretcode,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message: "Logged in successfully",
      data: {
        userDetails: {
          id: isuser._id,
          first_name: isuser.first_name,
          last_name: isuser.last_name,
          email: isuser.email,
          mobile: isuser.mobile,
          role: isuser.role,
          status: isuser.status,
        },
        token,
      },
    });
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
};

const userdetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodetoken = jwt.verify(token, process.env.secretcode);
    if (!decodetoken)
      return res.status(200).json({ message: "token is not valid" });

    const userid = decodetoken.userId;
    const user = await UserModel.findOne({ _id: userid });

    res.status(200).json({ user });
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
};

const filteruser = async (req, res) => {
  try {
    const { name, email, mobile, status, role } = req.query;
    // Define the filter object to build the query
    const filter = {};
    console.log(55,filter)

    if (name) {
        // Use a regular expression to perform a case-insensitive name search
        filter.$or = [
          { first_name: { $regex: new RegExp(name, 'i') } },
          { last_name: { $regex: new RegExp(name, 'i') } },
        ];
      }

      if (email) {
        filter.email = email;
      }
    
      if (mobile) {
        filter.mobile = mobile;
      }
    
      if (status) {
        filter.status = status;
      }
    
      if (role) {
        filter.role = role;
      }
      
     console.log(77555,!filter)
      const users = await UserModel.find(filter);
      res.status(200).json({users})

  } catch (err) {
    res.status(501).json({ message: err.message });
  }
};

// app.post('/api/users/register', async (req, res) => {
//     const { first_name, last_name, email, mobile, password, role, status } = req.body;

//     // Validation checks
//     if (!first_name || !last_name || !email || !mobile || !password || !role || !status) {
//       return res.status(501).json({ message: 'All fields are mandatory' });
//     }

//     if (mobile.length !== 10) {
//       return res.status(501).json({ message: 'Mobile should be 10 characters long' });
//     }

//     if (
//       password.length < 8 ||
//       !containsUpperCaseLetter(password) ||
//       !containsSpecialCharacter(password)
//     ) {
//       return res.status(501).json({
//         message:
//           'Password requirements not met: minimum 8 characters, one capital letter, and one special character',
//       });
//     }

//     const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
//     if (existingUser) {
//       return res.status(501).json({ message: 'Duplicate email or mobile number' });
//     }

//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       first_name,
//       last_name,
//       email,
//       mobile,
//       password: hashedPassword,
//       role,
//       status,
//     });

//     try {
//       await newUser.save();
//       res.status(200).json({ message: 'Account successfully created' });
//     } catch (err) {
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

//   function containsUpperCaseLetter(password) {
//     for (let i = 0; i < password.length; i++) {
//       if (password[i] >= 'A' && password[i] <= 'Z') {
//         return true;
//       }
//     }
//     return false;
//   }

//   function containsSpecialCharacter(password) {
//     const specialCharacters = '!@#$%^&*';
//     for (let i = 0; i < password.length; i++) {
//       if (specialCharacters.includes(password[i])) {
//         return true;
//       }
//     }
//     return false;
//   }

module.exports = {
  userRegister,
  userlogin,
  userdetails,
  filteruser,
};
