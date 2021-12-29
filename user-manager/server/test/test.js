let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

const auth_service = "http://localhost:3010";
const app = "http://localhost:3000";

describe("/GET List User", () => {
  let access_token;
  it("it should POST login", (done) => {
    let user = {
      username: "test_admin",
      salted_hash: "test_admin",
    };
    chai
      .request(auth_service)
      .post("/")
      .send(user)
      .end((err, res) => {
        access_token = res.body.Access_Token;
        res.should.have.status(200);
        done();
      });
  });
  it("it should GET control acces token valid", (done) => {
    let token = {
      access_token: access_token,
    };
    chai
      .request(auth_service)
      .post("/isAccessTokenValid")
      .send(token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("it should POST a user", (done) => {
    let user = {
      username: "test_username",
      user_name: "test_name",
      user_surname: "test_surname",
      user_email: "test_email@mail.com",
      user_password: "testpassword",
      user_type: "User",
    };
    chai
      .request(app)
      .post("/createuser")
      .set("Authorization", access_token)
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("it should GET all users", (done) => {
    chai
      .request(app)
      .get("/listuser")
      .set("Authorization", access_token)
      .end((err, res) => {
        new_user_id = res.body.data[res.body.data.length - 1].id;
        res.should.have.status(200);
        done();
      });
  });
  it("it should GET specific user", (done) => {
    chai
      .request(app)
      .get(`/user/${new_user_id}`)
      .set("Authorization", access_token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should PUT a user", (done) => {
    let user = {
      username: "test_updated_name",
      user_name: "testest_updated_username",
      user_surname: "test_updated_surname",
      user_email: "test_updated_email",
      user_password: "test_updated_password",
      user_type: "User",
    };
    chai
      .request(app)
      .put(`/updateuser/${new_user_id}`)
      .set("Authorization", access_token)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("it should DELETE a user", (done) => {
    chai
      .request(app)
      .get(`/deleteuser/${new_user_id}`)
      .set("Authorization", access_token)

      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
