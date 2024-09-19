
'use strict';
const { createHash } = require('crypto');

module.exports = env => {
  console.log("xxx",JSON.stringify(env));
  const hash = createHash('md5');
  hash.update(JSON.stringify(env));
  
  return hash.digest('hex');
};
