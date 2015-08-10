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

var UserSchema = new Schema({
  firstName: String,
  lastName: String
});

UserSchema.plugin(plugin);

var User = mongoose.model('User', UserSchema);

describe('CreatedAt and UpdatedAt support', function() {
  var user;

  before(function (done) {
    user = new User({ firstName: 'James' });
    done();
  });

  it('should has "James" as firstname', function (done) {
    user.firstName.should.equal('James');
    done();
  });

  it('should save user without error', function (done) {
    user.save(done);
  });

  it('should createdAt and updatedAt have equal values', function (done) {
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

  after(function (done) {
    user.remove({} , function () {
      mongoose.connection.db.dropDatabase();
      done();
    });
  });
});
