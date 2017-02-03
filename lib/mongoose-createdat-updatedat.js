var extend = require('extend');

module.exports = function createdAt_updatedAt(schema, options) {
  var defaults = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  var opts = extend({}, defaults, options);
  var addSchema = {};

  if (opts.createdAt) {
    addSchema[opts.createdAt] = Date;
  }
  if (opts.updatedAt) {
    addSchema[opts.updatedAt] = Date;
  }

  schema.add(addSchema);

  schema.pre('save', function (next) {
    var currentDate = new Date();

    if (opts.updatedAt) {
      this[opts.updatedAt] = currentDate;
    }

    if (opts.createdAt && !this[opts.createdAt]) {
      this[opts.createdAt] = currentDate;
    }

    next();
  });
};
