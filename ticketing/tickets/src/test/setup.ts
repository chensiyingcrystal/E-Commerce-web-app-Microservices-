import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from "supertest";
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  function signin(): string[];
}

jest.mock("../nats-wrapper.ts");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //hard code edition of signin
  // const email = "test@test.com";
  // const password = "password";

  // const response = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email, password
  //   })
  //   .expect(201);

  // const cookie = response.get("Set-Cookie");

  // return cookie;

  //skip saving the email and password into the database
  //build a JWT payload ({ id, email})
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object ({jwt: MY_JWT})
  const session  = { jwt: token };

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string that's the cookie with the encoded data
  return [`session=${base64}`];

}