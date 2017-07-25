wysihtml.commands.insertTDPinlineBlue = (function() {
  var REG_EXP = /inline-blue-sans-h/g;

  return {
    exec: function(composer, command, size) {
      wysihtml.commands.formatInline.exec(composer, command, {className: "inline-blue-sans-h", classRegExp: REG_EXP, toggle: true});
    },

    state: function(composer, command, size) {
      return wysihtml.commands.formatInline.state(composer, command, {className: "inline-blue-sans-h"});
    }
  };
})();

wysihtml.commands.insertTDPinlineBlack = (function() {
  var REG_EXP = /inline-black-sans-h/g;

  return {
    exec: function(composer, command, size) {
      wysihtml.commands.formatInline.exec(composer, command, {className: "inline-black-sans-h", classRegExp: REG_EXP, toggle: true});
    },

    state: function(composer, command, size) {
      return wysihtml.commands.formatInline.state(composer, command, {className: "inline-black-sans-h"});
    }
  };
})();

