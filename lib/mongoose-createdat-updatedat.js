/**
 * Called on doc-based save hook
 * @param {function} next 
 * @param {object} options 
 */
function preDocSaveHook(next, options) {
  const currentDate = new Date();

  if (options.updatedAt) {
    this[options.updatedAt] = currentDate;
  }

  if (options.createdAt && !this[options.createdAt]) {
    this[options.createdAt] = currentDate;
  }

  next();
}

/**
 * Called on query-based hooks, like update or findOneAndUpdate
 * @param {function} next 
 * @param {object} options 
 */
function preQuerySaveHook(next, options) {
  const currentDate = new Date();

  const update = this.getUpdate();

  if (options.updatedAt) {
    update[options.updatedAt] = currentDate;
  }

  if (options.createdAt && !update[options.createdAt]) {
    const setOnInsert = update.$setOnInsert || {};
    setOnInsert[options.createdAt] = currentDate;
    update.$setOnInsert = setOnInsert;
  }

  if (options.updatedAt || options.createdAt) {
    this.setUpdate(update);
  }

  next();
}

module.exports = function createdAt_updatedAt(schema, options) {
  const defaults = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  const opts = { ...defaults, ...options };
  const addSchema = {};

  if (opts.createdAt) {
    addSchema[opts.createdAt] = Date;
  }
  if (opts.updatedAt) {
    addSchema[opts.updatedAt] = Date;
  }

  schema.add(addSchema);

  schema.pre('save', function (next) {
    preDocSaveHook.call(this, next, opts);
  });

  schema.pre('update', function (next) {
    preQuerySaveHook.call(this, next, opts);
  });

  schema.pre('updateOne', function (next) {
    preQuerySaveHook.call(this, next, opts);
  });

  schema.pre('findOneAndUpdate', function (next) {
    preQuerySaveHook.call(this, next, opts);
  });
};
