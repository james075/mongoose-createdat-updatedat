#Mongoose-createdAt-updatedAt

A mongoose plugin that adds createdAt and updatedAt fields to subscribed models in order to avoid redundancy.

###Install via npm:

```bash
$> npm install mongoose-createdat-updatedat --save
```

###Usage:

```js
var plugin = require('mongoose-createdat-updatedat');
var User = new Schema({ ... });
User.plugin(plugin);
```

###Test:

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