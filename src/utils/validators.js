import validator from "validator";
const validateRegisterUser = (req,res,next)=>{
 let {fullName , email , password} = req.body
 if(!fullName || !email || !password){
   return res.status(400).json({
        message : "Bad input"
    }) 
 }
 fullName = fullName.trim();
 fullName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
email = email.trim().toLowerCase();
password = password.trim();
 if(!validator.isEmail(email)){
  return res.status(400).json({
        message : "Bad input while checking email"
    })
 }
 if(typeof fullName !== "string" ){
   return  res.status(400).json({
        message : "Bad input"
    })
 }
 if(fullName.trim().length === 0) {
  return  res.status(400).json({ message: "Full name required" });
}

req.body.email = email
req.body.fullName = fullName
next()
}
const validateLoginUser = (req,res,next)=>{

 let { email , password} = req.body
 if(!email || !password){
   return res.status(400).json({
        message : "Bad input"
    }) 
 }
email = email.trim().toLowerCase();
password = password.trim();
 if(!validator.isEmail(email)){
  return res.status(400).json({
        message : "Bad input while checking email"
    })
 }
 if(typeof password !== "string" ){
   return  res.status(400).json({
        message : "Bad input"
    })
 }
req.body.email = email
next()
}


export {
    validateRegisterUser,
    validateLoginUser
}