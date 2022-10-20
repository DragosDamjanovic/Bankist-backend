import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("1111", 10),
    accountNumber: 1234567891234567,
    address: "Peti prigratski put bb",
    city: "Banjaluka",
    balance: "10000",
  },
  {
    name: "Dragos",
    email: "user@example.com",
    password: bcrypt.hashSync("2222", 10),
    accountNumber: 5678912345678912,
    address: "Peti prigratski put bb",
    city: "Banjaluka",
    balance: "10000",
  },
];

export default users;
