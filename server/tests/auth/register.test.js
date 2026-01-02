process.env.NODE_ENV = "test";

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import pool from "../../db/db.js";


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




afterAll(async () => {
    database = null;
});


describe("Tests the register functionality", ()=>{
    //ARRANGE
    console.log("Running tests in:", process.env.NODE_ENV);
    console.log("database:", database);
    const endpoint = "/api/auth/register"
    const newUser ={
       email:"shashi@example.com",
       username:"shashi",
       password:"123456",
       role:"user"
    }
     it("should register a new user successfully", async()=>{
        //ACT
        const res=await request(app).post(endpoint).send(newUser)
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("message","User registered successfully!")
     })

     it("should not a user with existing email",async()=>{
      const res=await request(app).post(endpoint).send(newUser)
      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty("message","User already exists!")
     })

})