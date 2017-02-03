// TODO: The tests should not actually use the database.
// They should test that the schema changes and the pre-save function is run
// as it is not the intention of the tests to check that Mongoose works

var should = require('should'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  plugin = require('../lib/mongoose-createdat-updatedat');

mongoose.connect('mongodb://localhost/createdat-updatedat-test');

mongoose.connection.on('error', function (err) {
  if (err) {
    console.error('MongoDB error: ' + err.message);
    console.error('Make sure a mongoDB server is running');
  }
});

describe('CreatedAt and UpdatedAt support', function() {
  var UserSchema;
  var User;
  var user;

  describe('with default options', function() {
    before(function (done) {
      UserSchema = new Schema({
        firstName: String,
        lastName: String
      });

      UserSchema.plugin(plugin);

      User = mongoose.model('UserDefault', UserSchema);

      user = new User({ firstName: 'James' });
      done();
    });

    it('should have "James" as firstname', function (done) {
      user.firstName.should.equal('James');
      done();
    });

    it('should save user without error', function (done) {
      user.save(done);
    });

    it('createdAt and updatedAt should have equal values', function (done) {
      user.createdAt.should.be.equal(user.updatedAt);
      done();
    });

    it('should update user lastname to "Heng" without error', function (done) {
      user.lastName = 'Heng';
      user.save(done);
    });

    it('updatedAt should be more recent than createdAt', function (done) {
      user.updatedAt.should.be.greaterThan(user.createdAt);
      done();
    });
  });

  describe('with disabled fields', function() {
    before(function (done) {
      UserSchema = new Schema({
        firstName: String,
        lastName: String
      });

      UserSchema.plugin(plugin, { createdAt: null });

      User = mongoose.model('UserOptionsDisabledField', UserSchema);

      user = new User({ firstName: 'James' });
      done();
    });

    it('should save user without error', function (done) {
      user.save(done);
    });

    it('createdAt field should not exist', function (done) {
      should.not.exist(user.createdAt);
      done();
    });

    it('updatedAt field should exist', function (done) {
      should.exist(user.updatedAt);
      done();
    });
  });

  describe('with changed name fields', function() {
    before(function (done) {
      UserSchema = new Schema({
        firstName: String,
        lastName: String
      });

      UserSchema.plugin(plugin, {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      });

      User = mongoose.model('UserOptionsChangedName', UserSchema);

      user = new User({ firstName: 'James' });
      done();
    });

    it('should save user without error', function (done) {
      user.save(done);
    });

    it('should have a "created_at" field', function (done) {
      should.exist(user.created_at);
      done();
    });

    it('should have an "updated_at" field', function (done) {
      should.exist(user.updated_at);
      done();
    });

    it('created_at and updated_at should have equal values', function (done) {
      user.created_at.should.be.equal(user.updated_at);
      done();
    });

    it('should update user lastname to "Heng" without error', function (done) {
      user.lastName = 'Heng';
      user.save(done);
    });

    it('updated_at should be more recent than created_at', function (done) {
      user.updated_at.should.be.greaterThan(user.created_at);
      done();
    });
  });

  after(function (done) {
    user.remove({} , function () {
      mongoose.connection.db.dropDatabase();
      done();
    });
  });
});
