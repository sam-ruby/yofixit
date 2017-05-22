'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inbox = mongoose.model('Inbox'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  inbox;

/**
 * Inbox routes tests
 */
describe('Inbox CRUD tests', function () {

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

    // Save a user to the test db and create new Inbox
    user.save(function () {
      inbox = {
        name: 'Inbox name'
      };

      done();
    });
  });

  it('should be able to save a Inbox if logged in', function (done) {
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

        // Save a new Inbox
        agent.post('/api/inboxes')
          .send(inbox)
          .expect(200)
          .end(function (inboxSaveErr, inboxSaveRes) {
            // Handle Inbox save error
            if (inboxSaveErr) {
              return done(inboxSaveErr);
            }

            // Get a list of Inboxes
            agent.get('/api/inboxes')
              .end(function (inboxesGetErr, inboxesGetRes) {
                // Handle Inboxes save error
                if (inboxesGetErr) {
                  return done(inboxesGetErr);
                }

                // Get Inboxes list
                var inboxes = inboxesGetRes.body;

                // Set assertions
                (inboxes[0].user._id).should.equal(userId);
                (inboxes[0].name).should.match('Inbox name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Inbox if not logged in', function (done) {
    agent.post('/api/inboxes')
      .send(inbox)
      .expect(403)
      .end(function (inboxSaveErr, inboxSaveRes) {
        // Call the assertion callback
        done(inboxSaveErr);
      });
  });

  it('should not be able to save an Inbox if no name is provided', function (done) {
    // Invalidate name field
    inbox.name = '';

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

        // Save a new Inbox
        agent.post('/api/inboxes')
          .send(inbox)
          .expect(400)
          .end(function (inboxSaveErr, inboxSaveRes) {
            // Set message assertion
            (inboxSaveRes.body.message).should.match('Please fill Inbox name');

            // Handle Inbox save error
            done(inboxSaveErr);
          });
      });
  });

  it('should be able to update an Inbox if signed in', function (done) {
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

        // Save a new Inbox
        agent.post('/api/inboxes')
          .send(inbox)
          .expect(200)
          .end(function (inboxSaveErr, inboxSaveRes) {
            // Handle Inbox save error
            if (inboxSaveErr) {
              return done(inboxSaveErr);
            }

            // Update Inbox name
            inbox.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Inbox
            agent.put('/api/inboxes/' + inboxSaveRes.body._id)
              .send(inbox)
              .expect(200)
              .end(function (inboxUpdateErr, inboxUpdateRes) {
                // Handle Inbox update error
                if (inboxUpdateErr) {
                  return done(inboxUpdateErr);
                }

                // Set assertions
                (inboxUpdateRes.body._id).should.equal(inboxSaveRes.body._id);
                (inboxUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Inboxes if not signed in', function (done) {
    // Create new Inbox model instance
    var inboxObj = new Inbox(inbox);

    // Save the inbox
    inboxObj.save(function () {
      // Request Inboxes
      request(app).get('/api/inboxes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Inbox if not signed in', function (done) {
    // Create new Inbox model instance
    var inboxObj = new Inbox(inbox);

    // Save the Inbox
    inboxObj.save(function () {
      request(app).get('/api/inboxes/' + inboxObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', inbox.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Inbox with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inboxes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inbox is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Inbox which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Inbox
    request(app).get('/api/inboxes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Inbox with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Inbox if signed in', function (done) {
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

        // Save a new Inbox
        agent.post('/api/inboxes')
          .send(inbox)
          .expect(200)
          .end(function (inboxSaveErr, inboxSaveRes) {
            // Handle Inbox save error
            if (inboxSaveErr) {
              return done(inboxSaveErr);
            }

            // Delete an existing Inbox
            agent.delete('/api/inboxes/' + inboxSaveRes.body._id)
              .send(inbox)
              .expect(200)
              .end(function (inboxDeleteErr, inboxDeleteRes) {
                // Handle inbox error error
                if (inboxDeleteErr) {
                  return done(inboxDeleteErr);
                }

                // Set assertions
                (inboxDeleteRes.body._id).should.equal(inboxSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Inbox if not signed in', function (done) {
    // Set Inbox user
    inbox.user = user;

    // Create new Inbox model instance
    var inboxObj = new Inbox(inbox);

    // Save the Inbox
    inboxObj.save(function () {
      // Try deleting Inbox
      request(app).delete('/api/inboxes/' + inboxObj._id)
        .expect(403)
        .end(function (inboxDeleteErr, inboxDeleteRes) {
          // Set message assertion
          (inboxDeleteRes.body.message).should.match('User is not authorized');

          // Handle Inbox error error
          done(inboxDeleteErr);
        });

    });
  });

  it('should be able to get a single Inbox that has an orphaned user reference', function (done) {
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

          // Save a new Inbox
          agent.post('/api/inboxes')
            .send(inbox)
            .expect(200)
            .end(function (inboxSaveErr, inboxSaveRes) {
              // Handle Inbox save error
              if (inboxSaveErr) {
                return done(inboxSaveErr);
              }

              // Set assertions on new Inbox
              (inboxSaveRes.body.name).should.equal(inbox.name);
              should.exist(inboxSaveRes.body.user);
              should.equal(inboxSaveRes.body.user._id, orphanId);

              // force the Inbox to have an orphaned user reference
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

                    // Get the Inbox
                    agent.get('/api/inboxes/' + inboxSaveRes.body._id)
                      .expect(200)
                      .end(function (inboxInfoErr, inboxInfoRes) {
                        // Handle Inbox error
                        if (inboxInfoErr) {
                          return done(inboxInfoErr);
                        }

                        // Set assertions
                        (inboxInfoRes.body._id).should.equal(inboxSaveRes.body._id);
                        (inboxInfoRes.body.name).should.equal(inbox.name);
                        should.equal(inboxInfoRes.body.user, undefined);

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
      Inbox.remove().exec(done);
    });
  });
});
