const should = require('should'),
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer,
  mongod = new MongoMemoryServer(),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  plugin = require('../lib/mongoose-createdat-updatedat');

describe('CreatedAt and UpdatedAt support', function() {
  let UserSchema;
  let User;
  let user;

  before(async function(done) {
    const mongoUri = await mongod.getConnectionString();

    // mongoose.connect('mongodb://localhost/createdat-updatedat-test');
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    mongoose.connection.on('error', function (err) {
      if (err) {
        console.error('MongoDB error: ' + err.message);
        console.error('Make sure a mongoDB server is running');
      }
    });

    done();
  });

  describe('pre save hook', function() {

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

      it('should have a "createdAt" field', function (done) {
        should.exist(user.createdAt);
        done();
      });

      it('should have an "updatedAt" field', function (done) {
        should.exist(user.updatedAt);
        done();
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
  });

  describe('pre update hook', function() {

    let result;

    before(function () {
      UserSchema = new Schema({
        firstName: String,
        lastName: String
      });

      UserSchema.plugin(plugin);

      User = mongoose.model('UserUpdate', UserSchema);

      user = new User();
    });

    it('should run upsert query without error', async function () {
      result = await user.update({ firstName: 'James' }, {upsert: true}).exec();
    });

    it('should have upserted user', async function() {
      user = await User.findById(result.upserted[0]._id);
      should.exist(user);
    })

    it('should have a "createdAt" field', function () {
      should.exist(user.createdAt);
    });

    it('should have an "updatedAt" field', function () {
      should.exist(user.createdAt);
    });

    it('createdAt and updatedAt should have equal values', function () {
      user.createdAt.toISOString().should.be.equal(user.updatedAt.toISOString());
    });

    it('should run update query without error', async function () {
      result = await user.update({ firstName: 'John' }).exec();
    });

    it('updatedAt should be more recent than createdAt', async function () {
      user = await User.findById(user._id);
      user.updatedAt.should.be.greaterThan(user.createdAt);
    });
  });

  after(function (done) {
    user.remove({} , function () {
      mongoose.connection.db.dropDatabase();
      done();
    });
  });
});
