const


if(process.NODE_ENV !="Production"{
  require("dotenv").config;
}console.log(process.env.SECRET);
)