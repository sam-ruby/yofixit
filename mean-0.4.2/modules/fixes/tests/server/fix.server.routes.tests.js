'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Fix = mongoose.model('Fix'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fix;

/**
 * Fix routes tests
 */
describe('Fix CRUD tests', function () {

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

    // Save a user to the test db and create new Fix
    user.save(function () {
      fix = {
        name: 'Fix name'
      };

      done();
    });
  });

  it('should be able to save a Fix if logged in', function (done) {
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

        // Save a new Fix
        agent.post('/api/fixes')
          .send(fix)
          .expect(200)
          .end(function (fixSaveErr, fixSaveRes) {
            // Handle Fix save error
            if (fixSaveErr) {
              return done(fixSaveErr);
            }

            // Get a list of Fixes
            agent.get('/api/fixes')
              .end(function (fixesGetErr, fixesGetRes) {
                // Handle Fixes save error
                if (fixesGetErr) {
                  return done(fixesGetErr);
                }

                // Get Fixes list
                var fixes = fixesGetRes.body;

                // Set assertions
                (fixes[0].user._id).should.equal(userId);
                (fixes[0].name).should.match('Fix name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Fix if not logged in', function (done) {
    agent.post('/api/fixes')
      .send(fix)
      .expect(403)
      .end(function (fixSaveErr, fixSaveRes) {
        // Call the assertion callback
        done(fixSaveErr);
      });
  });

  it('should not be able to save an Fix if no name is provided', function (done) {
    // Invalidate name field
    fix.name = '';

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

        // Save a new Fix
        agent.post('/api/fixes')
          .send(fix)
          .expect(400)
          .end(function (fixSaveErr, fixSaveRes) {
            // Set message assertion
            (fixSaveRes.body.message).should.match('Please fill Fix name');

            // Handle Fix save error
            done(fixSaveErr);
          });
      });
  });

  it('should be able to update an Fix if signed in', function (done) {
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

        // Save a new Fix
        agent.post('/api/fixes')
          .send(fix)
          .expect(200)
          .end(function (fixSaveErr, fixSaveRes) {
            // Handle Fix save error
            if (fixSaveErr) {
              return done(fixSaveErr);
            }

            // Update Fix name
            fix.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Fix
            agent.put('/api/fixes/' + fixSaveRes.body._id)
              .send(fix)
              .expect(200)
              .end(function (fixUpdateErr, fixUpdateRes) {
                // Handle Fix update error
                if (fixUpdateErr) {
                  return done(fixUpdateErr);
                }

                // Set assertions
                (fixUpdateRes.body._id).should.equal(fixSaveRes.body._id);
                (fixUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Fixes if not signed in', function (done) {
    // Create new Fix model instance
    var fixObj = new Fix(fix);

    // Save the fix
    fixObj.save(function () {
      // Request Fixes
      request(app).get('/api/fixes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Fix if not signed in', function (done) {
    // Create new Fix model instance
    var fixObj = new Fix(fix);

    // Save the Fix
    fixObj.save(function () {
      request(app).get('/api/fixes/' + fixObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fix.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Fix with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fixes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Fix is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Fix which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Fix
    request(app).get('/api/fixes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Fix with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Fix if signed in', function (done) {
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

        // Save a new Fix
        agent.post('/api/fixes')
          .send(fix)
          .expect(200)
          .end(function (fixSaveErr, fixSaveRes) {
            // Handle Fix save error
            if (fixSaveErr) {
              return done(fixSaveErr);
            }

            // Delete an existing Fix
            agent.delete('/api/fixes/' + fixSaveRes.body._id)
              .send(fix)
              .expect(200)
              .end(function (fixDeleteErr, fixDeleteRes) {
                // Handle fix error error
                if (fixDeleteErr) {
                  return done(fixDeleteErr);
                }

                // Set assertions
                (fixDeleteRes.body._id).should.equal(fixSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Fix if not signed in', function (done) {
    // Set Fix user
    fix.user = user;

    // Create new Fix model instance
    var fixObj = new Fix(fix);

    // Save the Fix
    fixObj.save(function () {
      // Try deleting Fix
      request(app).delete('/api/fixes/' + fixObj._id)
        .expect(403)
        .end(function (fixDeleteErr, fixDeleteRes) {
          // Set message assertion
          (fixDeleteRes.body.message).should.match('User is not authorized');

          // Handle Fix error error
          done(fixDeleteErr);
        });

    });
  });

  it('should be able to get a single Fix that has an orphaned user reference', function (done) {
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

          // Save a new Fix
          agent.post('/api/fixes')
            .send(fix)
            .expect(200)
            .end(function (fixSaveErr, fixSaveRes) {
              // Handle Fix save error
              if (fixSaveErr) {
                return done(fixSaveErr);
              }

              // Set assertions on new Fix
              (fixSaveRes.body.name).should.equal(fix.name);
              should.exist(fixSaveRes.body.user);
              should.equal(fixSaveRes.body.user._id, orphanId);

              // force the Fix to have an orphaned user reference
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

                    // Get the Fix
                    agent.get('/api/fixes/' + fixSaveRes.body._id)
                      .expect(200)
                      .end(function (fixInfoErr, fixInfoRes) {
                        // Handle Fix error
                        if (fixInfoErr) {
                          return done(fixInfoErr);
                        }

                        // Set assertions
                        (fixInfoRes.body._id).should.equal(fixSaveRes.body._id);
                        (fixInfoRes.body.name).should.equal(fix.name);
                        should.equal(fixInfoRes.body.user, undefined);

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
      Fix.remove().exec(done);
    });
  });
});
