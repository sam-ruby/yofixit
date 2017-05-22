'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Automotive = mongoose.model('Automotive'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  automotive;

/**
 * Automotive routes tests
 */
describe('Automotive CRUD tests', function () {

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

    // Save a user to the test db and create new Automotive
    user.save(function () {
      automotive = {
        name: 'Automotive name'
      };

      done();
    });
  });

  it('should be able to save a Automotive if logged in', function (done) {
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

        // Save a new Automotive
        agent.post('/api/automotives')
          .send(automotive)
          .expect(200)
          .end(function (automotiveSaveErr, automotiveSaveRes) {
            // Handle Automotive save error
            if (automotiveSaveErr) {
              return done(automotiveSaveErr);
            }

            // Get a list of Automotives
            agent.get('/api/automotives')
              .end(function (automotivesGetErr, automotivesGetRes) {
                // Handle Automotives save error
                if (automotivesGetErr) {
                  return done(automotivesGetErr);
                }

                // Get Automotives list
                var automotives = automotivesGetRes.body;

                // Set assertions
                (automotives[0].user._id).should.equal(userId);
                (automotives[0].name).should.match('Automotive name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Automotive if not logged in', function (done) {
    agent.post('/api/automotives')
      .send(automotive)
      .expect(403)
      .end(function (automotiveSaveErr, automotiveSaveRes) {
        // Call the assertion callback
        done(automotiveSaveErr);
      });
  });

  it('should not be able to save an Automotive if no name is provided', function (done) {
    // Invalidate name field
    automotive.name = '';

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

        // Save a new Automotive
        agent.post('/api/automotives')
          .send(automotive)
          .expect(400)
          .end(function (automotiveSaveErr, automotiveSaveRes) {
            // Set message assertion
            (automotiveSaveRes.body.message).should.match('Please fill Automotive name');

            // Handle Automotive save error
            done(automotiveSaveErr);
          });
      });
  });

  it('should be able to update an Automotive if signed in', function (done) {
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

        // Save a new Automotive
        agent.post('/api/automotives')
          .send(automotive)
          .expect(200)
          .end(function (automotiveSaveErr, automotiveSaveRes) {
            // Handle Automotive save error
            if (automotiveSaveErr) {
              return done(automotiveSaveErr);
            }

            // Update Automotive name
            automotive.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Automotive
            agent.put('/api/automotives/' + automotiveSaveRes.body._id)
              .send(automotive)
              .expect(200)
              .end(function (automotiveUpdateErr, automotiveUpdateRes) {
                // Handle Automotive update error
                if (automotiveUpdateErr) {
                  return done(automotiveUpdateErr);
                }

                // Set assertions
                (automotiveUpdateRes.body._id).should.equal(automotiveSaveRes.body._id);
                (automotiveUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Automotives if not signed in', function (done) {
    // Create new Automotive model instance
    var automotiveObj = new Automotive(automotive);

    // Save the automotive
    automotiveObj.save(function () {
      // Request Automotives
      request(app).get('/api/automotives')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Automotive if not signed in', function (done) {
    // Create new Automotive model instance
    var automotiveObj = new Automotive(automotive);

    // Save the Automotive
    automotiveObj.save(function () {
      request(app).get('/api/automotives/' + automotiveObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', automotive.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Automotive with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/automotives/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Automotive is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Automotive which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Automotive
    request(app).get('/api/automotives/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Automotive with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Automotive if signed in', function (done) {
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

        // Save a new Automotive
        agent.post('/api/automotives')
          .send(automotive)
          .expect(200)
          .end(function (automotiveSaveErr, automotiveSaveRes) {
            // Handle Automotive save error
            if (automotiveSaveErr) {
              return done(automotiveSaveErr);
            }

            // Delete an existing Automotive
            agent.delete('/api/automotives/' + automotiveSaveRes.body._id)
              .send(automotive)
              .expect(200)
              .end(function (automotiveDeleteErr, automotiveDeleteRes) {
                // Handle automotive error error
                if (automotiveDeleteErr) {
                  return done(automotiveDeleteErr);
                }

                // Set assertions
                (automotiveDeleteRes.body._id).should.equal(automotiveSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Automotive if not signed in', function (done) {
    // Set Automotive user
    automotive.user = user;

    // Create new Automotive model instance
    var automotiveObj = new Automotive(automotive);

    // Save the Automotive
    automotiveObj.save(function () {
      // Try deleting Automotive
      request(app).delete('/api/automotives/' + automotiveObj._id)
        .expect(403)
        .end(function (automotiveDeleteErr, automotiveDeleteRes) {
          // Set message assertion
          (automotiveDeleteRes.body.message).should.match('User is not authorized');

          // Handle Automotive error error
          done(automotiveDeleteErr);
        });

    });
  });

  it('should be able to get a single Automotive that has an orphaned user reference', function (done) {
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

          // Save a new Automotive
          agent.post('/api/automotives')
            .send(automotive)
            .expect(200)
            .end(function (automotiveSaveErr, automotiveSaveRes) {
              // Handle Automotive save error
              if (automotiveSaveErr) {
                return done(automotiveSaveErr);
              }

              // Set assertions on new Automotive
              (automotiveSaveRes.body.name).should.equal(automotive.name);
              should.exist(automotiveSaveRes.body.user);
              should.equal(automotiveSaveRes.body.user._id, orphanId);

              // force the Automotive to have an orphaned user reference
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

                    // Get the Automotive
                    agent.get('/api/automotives/' + automotiveSaveRes.body._id)
                      .expect(200)
                      .end(function (automotiveInfoErr, automotiveInfoRes) {
                        // Handle Automotive error
                        if (automotiveInfoErr) {
                          return done(automotiveInfoErr);
                        }

                        // Set assertions
                        (automotiveInfoRes.body._id).should.equal(automotiveSaveRes.body._id);
                        (automotiveInfoRes.body.name).should.equal(automotive.name);
                        should.equal(automotiveInfoRes.body.user, undefined);

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
      Automotive.remove().exec(done);
    });
  });
});
