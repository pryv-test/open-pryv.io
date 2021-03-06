/**
 * @license
 * Copyright (c) 2020 Pryv S.A. https://pryv.com
 * 
 * This file is part of Open-Pryv.io and released under BSD-Clause-3 License
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, 
 *    this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its contributors 
 *    may be used to endorse or promote products derived from this software 
 *    without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 */
var async = require('async'),
    BaseStorage = require('./user/BaseStorage'),
    converters = require('./converters'),
    encryption = require('components/utils').encryption,
    util = require('util'),
    _ = require('lodash');

module.exports = Users;
/**
 * DB persistence for users.
 *
 * @param {Database} database
 * @constructor
 */
function Users(database) {
  Users.super_.call(this, database);

  _.extend(this.converters, {
    itemDefaults: [converters.createIdIfMissing]
  });

  this.defaultOptions = {
    sort: {username: 1}
  };
}
util.inherits(Users, BaseStorage);

var indexes = [
  {
    index: {username: 1},
    options: {unique: true}
  },
  {
    index: {email: 1},
    options: {unique: true}
  }
];

/**
 * Implementation.
 */
Users.prototype.getCollectionInfo = function () {
  return {
    name: 'users',
    indexes: indexes
  };
};

/**
 * Override.
 */
Users.prototype.count = function (query, callback) {
  Users.super_.prototype.count.call(this, null, query, callback);
};

/**
 * Override.
 */
Users.prototype.countAll = function (callback) {
  Users.super_.prototype.countAll.call(this, null, callback);
};

/**
 * Override.
 */
Users.prototype.findOne = function (query, options, callback) {
  Users.super_.prototype.findOne.call(this, null, query, options, callback);
};

/**
 * Override.
 */
Users.prototype.findOneAndUpdate = function (query, updatedData, callback) {
  var self = this;
  encryptPassword(updatedData, function (err, update) {
    if (err) { return callback(err); }
    Users.super_.prototype.findOneAndUpdate.call(self, null, query, update, callback);
  });
};

/**
 * Override.
 * Inserts a single item, encrypting `password` into `passwordHash`.
 *
 * @param {Function} callback ({Error}, {String})
 */
Users.prototype.insertOne = function (user, callback) {
  var self = this;
  encryptPassword(user, function (err, dbUser) {
    if (err) { return callback(err); }
    Users.super_.prototype.insertOne.call(self, null, dbUser, callback);
  });
};

/**
 * Override.
 */
Users.prototype.updateOne = function (query, updatedData, callback) {
  var self = this;
  encryptPassword(updatedData, function (err, update) {
    if (err) { return callback(err); }
    Users.super_.prototype.updateOne.call(self, null, query, update, callback);
  });
};

/**
 * Override.
 * Inserts an array of items, encrypting `password` into `passwordHash`.
 * Each item must have a valid id already.
 */
Users.prototype.insertMany = function (users, callback) {
  var self = this;
  async.map(users, encryptPassword, function (err, dbUsers) {
    if (err) { return callback(err); }
    Users.super_.prototype.insertMany.call(self, null, dbUsers, callback);
  });
};



/**
 * @param {Function} callback (error, dbUser) `dbUser` is a clone of the original user.
 */
function encryptPassword(user, callback) {
  const dbUser = _.clone(user);
  if (dbUser.password != null) {
    encryption.hash(dbUser.password, function (err, hash) {
      if (err != null) return callback(err);

      dbUser.passwordHash = hash;
      delete dbUser.password;

      callback(null, dbUser);
    });
  } else {
    // Nothing to encrypt
    callback(null, dbUser);
  }
}

/**
 * Override.
 */
Users.prototype.remove = function (query, callback) {
  Users.super_.prototype.removeMany.call(this, null, query, callback);
};

/**
 * Override.
 */
Users.prototype.findAll = function (options, callback) {
  Users.super_.prototype.findAll.call(this, null, options, callback);
};

/**
 * Override.
 */
Users.prototype.find = function (query, options, callback) {
  Users.super_.prototype.find.call(this, null, query, options, callback);
};

/**
 * Override.
 * For tests only.
 */
Users.prototype.removeAll = function (callback) {
  Users.super_.prototype.removeAll.call(this, null, callback);
};
