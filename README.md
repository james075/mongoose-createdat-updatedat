# Mongoose-createdAt-updatedAt

A mongoose plugin that adds createdAt and updatedAt fields to subscribed models in order to avoid redundancy.

### Install via npm:

```bash
$> npm install mongoose-createdat-updatedat --save
```

### Usage:

```js
var plugin = require('mongoose-createdat-updatedat');
var User = new Schema({ ... });
User.plugin(plugin);
```

Optionally, you can pass an options object to set the name of the fields, or to disable certain fields.

Another example:

```js
var plugin = require('mongoose-createdat-updatedat');
var User = new Schema({ ... });
var options = {
  createdAt: 'created_at',
  updatedAt: null
}
User.plugin(plugin, options);
```

Here, the createdAt field will be named `created_at`, and the updatedAt field will be disabled.

### Options:

##### createdAt
Type: `String`  
Default: `createdAt`

Name of the createdAt field. Set to null to disable the field

##### updatedAt
Type: `String`  
Default: `updatedAt`

Name of the updatedAt field. Set to null to disable the field

### Test:

```bash
$> npm test
$>
  CreatedAt and UpdatedAt support
    ✓ should has "James" as firstname
    ✓ should save user without error (237ms)
    ✓ should createdAt and updatedAt have equal values
    ✓ should update user lastname to "Heng" without error
    ✓ updatedAt should be more recent than createdAt
```
