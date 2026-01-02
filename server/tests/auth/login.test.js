process.env.NODE_ENV = "test";

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import pool from "../../db/db.js";
import bcrypt from "bcryptjs";

let database;
let app;
beforeAll(async () => {
   //lazy load the app after setting NODE_ENV
  app = (await import("../../src/index.js")).default;

});

database = pool;
console.log("Database initialized for tests.",database);
const res = await pool.query("SELECT COUNT(*) FROM users");
console.log("Users table count:", res.rows[0].count);

beforeAll(async()=>{
   await pool.query("INSERT INTO users (email, password, username, role) VALUES ($1, $2, $3, $4)",
  ["shashi@gmail.com", bcrypt.hashSync("123456",12), "shashi", "admin"])
})

afterAll(async () => {
    database = null;
});

describe("Tests the login functionality",()=>{
    const endpoint ="/api/auth/login"
    const user={
       email:"shashi@gmail.com",
       username:"shashi",
       password:"123456",
       role:"admin"
    }

    it("should login user if credentials are correct",async()=>{
       const res=await request(app).post(endpoint).send(user)
       expect(res.status).toBe(200)
       expect(res.body).toHaveProperty("message","Login successful")
    })

    it("should return error if password is incorrect", async()=>{
      const res=await request(app).post(endpoint).send({
        email:"shashi@gmail.com",
        username:"shashi",
        password:"1234565",
        role:"admin"
      })
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty("message","Password is incorrect!")
      expect(res.body).toHaveProperty("success","false")
    })

    it("should return error if user doesnt exists", async()=>{
       const res=await request(app).post(endpoint).send({
        email:"loki@gmail.com",
        username:"loki",
        password:"1234565",
        role:"admin"
       })
       expect(res.status).toBe(404)
       expect(res.body).toHaveProperty("message","User does not exists!")
       expect(res.body).toHaveProperty("success","false")
    })
})