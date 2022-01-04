let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

const app = "http://localhost:3010";
// Test SSO-auth server methods
describe("/ SSO-Auth", () => {
  let access_token;
  // Test if user exist in DB
  it("it should POST login", (done) => {
    let user = {
      username: "test_admin",
      salted_hash: "test_admin",
    };
    chai
      .request(app)
      .post("/")
      .send(user)
      .end((err, res) => {
        access_token = res.body.Access_Token;
        res.should.have.status(200);
        done();
      });
  });
  // Test, access token valid or expired
  it("it should GET control acces token valid", (done) => {
    let token = {
      access_token: access_token,
    };
    chai
      .request(app)
      .post("/isAccessTokenValid")
      .send(token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
