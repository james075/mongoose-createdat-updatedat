module.exports = exports = function createdAtAndUpdatedAt (schema) {
  schema.add({
    createdAt: Date,
    updatedAt: Date,
  });

  schema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt) {
      this.createdAt = currentDate;
    }
    next();
  });
};
