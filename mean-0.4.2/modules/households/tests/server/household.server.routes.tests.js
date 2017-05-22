'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Household = mongoose.model('Household'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  household;

/**
 * Household routes tests
 */
describe('Household CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Household
    user.save(function () {
      household = {
        name: 'Household name'
      };

      done();
    });
  });

  it('should be able to save a Household if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Household
        agent.post('/api/households')
          .send(household)
          .expect(200)
          .end(function (householdSaveErr, householdSaveRes) {
            // Handle Household save error
            if (householdSaveErr) {
              return done(householdSaveErr);
            }

            // Get a list of Households
            agent.get('/api/households')
              .end(function (householdsGetErr, householdsGetRes) {
                // Handle Households save error
                if (householdsGetErr) {
                  return done(householdsGetErr);
                }

                // Get Households list
                var households = householdsGetRes.body;

                // Set assertions
                (households[0].user._id).should.equal(userId);
                (households[0].name).should.match('Household name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Household if not logged in', function (done) {
    agent.post('/api/households')
      .send(household)
      .expect(403)
      .end(function (householdSaveErr, householdSaveRes) {
        // Call the assertion callback
        done(householdSaveErr);
      });
  });

  it('should not be able to save an Household if no name is provided', function (done) {
    // Invalidate name field
    household.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Household
        agent.post('/api/households')
          .send(household)
          .expect(400)
          .end(function (householdSaveErr, householdSaveRes) {
            // Set message assertion
            (householdSaveRes.body.message).should.match('Please fill Household name');

            // Handle Household save error
            done(householdSaveErr);
          });
      });
  });

  it('should be able to update an Household if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Household
        agent.post('/api/households')
          .send(household)
          .expect(200)
          .end(function (householdSaveErr, householdSaveRes) {
            // Handle Household save error
            if (householdSaveErr) {
              return done(householdSaveErr);
            }

            // Update Household name
            household.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Household
            agent.put('/api/households/' + householdSaveRes.body._id)
              .send(household)
              .expect(200)
              .end(function (householdUpdateErr, householdUpdateRes) {
                // Handle Household update error
                if (householdUpdateErr) {
                  return done(householdUpdateErr);
                }

                // Set assertions
                (householdUpdateRes.body._id).should.equal(householdSaveRes.body._id);
                (householdUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Households if not signed in', function (done) {
    // Create new Household model instance
    var householdObj = new Household(household);

    // Save the household
    householdObj.save(function () {
      // Request Households
      request(app).get('/api/households')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Household if not signed in', function (done) {
    // Create new Household model instance
    var householdObj = new Household(household);

    // Save the Household
    householdObj.save(function () {
      request(app).get('/api/households/' + householdObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', household.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Household with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/households/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Household is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Household which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Household
    request(app).get('/api/households/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Household with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Household if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Household
        agent.post('/api/households')
          .send(household)
          .expect(200)
          .end(function (householdSaveErr, householdSaveRes) {
            // Handle Household save error
            if (householdSaveErr) {
              return done(householdSaveErr);
            }

            // Delete an existing Household
            agent.delete('/api/households/' + householdSaveRes.body._id)
              .send(household)
              .expect(200)
              .end(function (householdDeleteErr, householdDeleteRes) {
                // Handle household error error
                if (householdDeleteErr) {
                  return done(householdDeleteErr);
                }

                // Set assertions
                (householdDeleteRes.body._id).should.equal(householdSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Household if not signed in', function (done) {
    // Set Household user
    household.user = user;

    // Create new Household model instance
    var householdObj = new Household(household);

    // Save the Household
    householdObj.save(function () {
      // Try deleting Household
      request(app).delete('/api/households/' + householdObj._id)
        .expect(403)
        .end(function (householdDeleteErr, householdDeleteRes) {
          // Set message assertion
          (householdDeleteRes.body.message).should.match('User is not authorized');

          // Handle Household error error
          done(householdDeleteErr);
        });

    });
  });

  it('should be able to get a single Household that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Household
          agent.post('/api/households')
            .send(household)
            .expect(200)
            .end(function (householdSaveErr, householdSaveRes) {
              // Handle Household save error
              if (householdSaveErr) {
                return done(householdSaveErr);
              }

              // Set assertions on new Household
              (householdSaveRes.body.name).should.equal(household.name);
              should.exist(householdSaveRes.body.user);
              should.equal(householdSaveRes.body.user._id, orphanId);

              // force the Household to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Household
                    agent.get('/api/households/' + householdSaveRes.body._id)
                      .expect(200)
                      .end(function (householdInfoErr, householdInfoRes) {
                        // Handle Household error
                        if (householdInfoErr) {
                          return done(householdInfoErr);
                        }

                        // Set assertions
                        (householdInfoRes.body._id).should.equal(householdSaveRes.body._id);
                        (householdInfoRes.body.name).should.equal(household.name);
                        should.equal(householdInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Household.remove().exec(done);
    });
  });
});
