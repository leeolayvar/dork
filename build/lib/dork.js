// Generated by CoffeeScript 1.3.3
(function() {
  var DEFAULT_OPTIONS, Dork, Runner, StdoutReporter, Suite, Test, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  utils = require('./utils');

  Runner = require('./runner').Runner;

  Suite = require('./suite').Suite;

  Test = require('./test').Test;

  StdoutReporter = require('./reporters').StdoutReporter;

  DEFAULT_OPTIONS = {
    global: false,
    reporters: [new StdoutReporter()]
  };

  Dork = (function() {

    function Dork(options) {
      var k, v;
      if (options == null) {
        options = {};
      }
      this.it = __bind(this.it, this);

      this.describe = __bind(this.describe, this);

      this.before_each = __bind(this.before_each, this);

      this.before_all = __bind(this.before_all, this);

      this.after_each = __bind(this.after_each, this);

      this.after_all = __bind(this.after_all, this);

      this._options = {};
      this._base_suite = this._active_suite = new Suite();
      for (k in DEFAULT_OPTIONS) {
        v = DEFAULT_OPTIONS[k];
        if (!(options[k] != null)) {
          options[k] = v;
        }
      }
      this.options(options);
      this._patterns = [];
    }

    Dork.prototype._option_global = function(value) {
      if (this._options.global === value) {
        return;
      }
      if (value) {
        global.after_all = this.after_all;
        global.after_each = this.after_each;
        global.before_all = this.before_all;
        global.before_each = this.before_each;
        global.describe = this.describe;
        global.it = this.it;
      } else if (this._options.global != null) {
        global.after_all = global.after_each = global.before_all = global.before_each = global.describe = global.it = void 0;
      }
      return this._options.global = value;
    };

    Dork.prototype._option_reporters = function(user_reporters) {
      var index, new_reporters, rem_reporters, reporter, _i, _j, _k, _len, _len1, _len2, _results;
      if (this._options.reporters != null) {
        rem_reporters = this._options.reporters.slice(0);
        new_reporters = [];
        for (_i = 0, _len = user_reporters.length; _i < _len; _i++) {
          reporter = user_reporters[_i];
          if (!(__indexOf.call(this._options.reporters, reporter) >= 0)) {
            new_reporters.push(reporter);
          } else {
            index = utils.index_of(rem_reporters, reporter);
            rem_reporters.splice(index, 0);
          }
        }
      } else {
        rem_reporters = [];
        new_reporters = user_reporters;
      }
      for (_j = 0, _len1 = new_reporters.length; _j < _len1; _j++) {
        reporter = new_reporters[_j];
        reporter.listen(this._base_suite);
      }
      _results = [];
      for (_k = 0, _len2 = rem_reporters.length; _k < _len2; _k++) {
        reporter = rem_reporters[_k];
        _results.push(reporter.remove(this._base_suite));
      }
      return _results;
    };

    Dork.prototype.after_all = function(fn) {
      return this._active_suite.add_after_all(new Runner(fn));
    };

    Dork.prototype.after_each = function(fn) {
      return this._active_suite.add_after_each(new Runner(fn));
    };

    Dork.prototype.before_all = function(fn) {
      return this._active_suite.add_before_all(new Runner(fn));
    };

    Dork.prototype.before_each = function(fn) {
      return this._active_suite.add_before_each(new Runner(fn));
    };

    Dork.prototype.describe = function(description, context_fn) {
      var new_suite, old_suite;
      old_suite = this._active_suite;
      new_suite = new Suite(description);
      this._active_suite.add_suite(new_suite);
      this._active_suite = new_suite;
      context_fn();
      return this._active_suite = old_suite;
    };

    Dork.prototype.it = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._active_suite.add_test((function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(Test, args, function(){}));
    };

    Dork.prototype.options = function(options) {
      var k, v, _results;
      if (options == null) {
        options = {};
      }
      _results = [];
      for (k in options) {
        v = options[k];
        if (this["_option_" + k] != null) {
          _results.push(this["_option_" + k](v));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dork.prototype.pattern = function() {
      var patterns, _ref;
      patterns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this._patterns).push.apply(_ref, patterns);
    };

    Dork.prototype.run = function() {
      var _ref;
      return (_ref = this._base_suite).run.apply(_ref, this._patterns);
    };

    return Dork;

  })();

  exports.create = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args), t = typeof result;
      return t == "object" || t == "function" ? result || child : child;
    })(Dork, args, function(){});
  };

  exports.Dork = Dork;

}).call(this);
