if (wysihtml5.browser.supported()) {
  module("wysihtml5.Editor.commands.formatBlock", {

    setup: function() {
        
      this.editableArea1        = document.createElement("div");
      this.editableArea1.id     = "wysihtml5-test-editable1";
      this.editableArea1.className = "wysihtml5-test-class1";
      this.editableArea1.title  = "Please enter your foo";
      this.editableArea1.innerHTML  = "hey tiff, what's up?";
      
      document.body.appendChild(this.editableArea1);
      
    },

    setCaretTo: function(editor, el, offset) {
        var r1 = editor.composer.selection.createRange();

        r1.setEnd(el, offset);
        r1.setStart(el, offset);
        editor.composer.selection.setSelection(r1);
    },

    setSelection: function(editor, el, offset, el2, offset2) {
      var r1 = editor.composer.selection.createRange();
      r1.setEnd(el2, offset2);
      r1.setStart(el, offset);
      editor.composer.selection.setSelection(r1);
    },

    teardown: function() {
      var leftover;
      this.editableArea1.parentNode.removeChild(this.editableArea1);
      while (leftover = document.querySelector("div.wysihtml5-test-class1, iframe.wysihtml5-sandbox, div.wysihtml5-sandbox")) {
        leftover.parentNode.removeChild(leftover);
      }
      document.body.className = this.originalBodyClassName;
    },

    equal: function(actual, expected, message) {
      return QUnit.assert.htmlEqual(actual, expected, message);
    },
  });

  // formatblock (alignment, headings, paragraph, pre, blockquote)
  asyncTest("Format block", function() {
     expect(14);
    var that = this,
        parserRules = {
            tags: {
              h1: true,
              h2: true,
              p: true,
              div: true,
              br: true
            }
          },
        editor = new wysihtml5.Editor(this.editableArea1, {
          parserRules: parserRules
        }),
        text = "once upon a time<br>there was an unformated text<br>spanning many lines.";

    var prepareMutipleBlocks = function(shiftEnds) {
      var text2 = "<h1>once upon a time</h1><p>there was a formated text</p>spanning many lines.";
      editor.setValue(text2, true);
      var heading = editor.editableElement.querySelector('h1'),
          paragraph = editor.editableElement.querySelector('p'),
          range = editor.composer.selection.createRange();

      if (!shiftEnds) {
        range.setStartBefore(heading);
        range.setEndAfter(paragraph);
      } else {
        range.setStart(heading.firstChild, 5);
        range.setEnd(paragraph.firstChild, 5);
      }

      editor.composer.selection.setSelection(range);
    };
      
    editor.on("load", function() {
      var editableElement   = that.editableArea1;
      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('justifyRight');
      equal(editableElement.innerHTML.toLowerCase(), '<div class="wysiwyg-text-align-right">' + text + '</div>', "Text corectly wrapped in one aligning div");

      editor.composer.selection.selectNode(editor.editableElement.querySelector('.wysiwyg-text-align-right'));
      editor.composer.commands.exec('formatBlock');
      equal(editableElement.innerHTML.toLowerCase(), text, "Aligning div correctly removed");

      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('alignRightStyle');
      equal(editableElement.innerHTML.toLowerCase(), '<div style="text-align: right;">' + text + '</div>', "Text corectly wrapped in one aligning div with style");

      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);

      that.setCaretTo(editor, editor.editableElement.childNodes[2], 1);
      editor.composer.commands.exec('justifyRight');
      equal(editableElement.innerHTML.toLowerCase(), 'once upon a time<br><div class="wysiwyg-text-align-right">there was an unformated text</div><br>spanning many lines.', "Only first line correctly wrapped in aligning div");

      var node = editor.editableElement.querySelector('.wysiwyg-text-align-right').firstChild;
      editor.composer.selection.selectNode(node);
      editor.composer.commands.exec('justifyLeft');
      equal(editableElement.innerHTML.toLowerCase().trim(), 'once upon a time<br><div class="wysiwyg-text-align-left">there was an unformated text</div><br>spanning many lines.', "First line wrapper class changed correctly");
      
      editableElement.innerHTML = '<p class="wysiwyg-text-align-left">once upon a time</p><br>there was an unformated text<br>spanning many lines.';
      node = editor.editableElement.querySelector('p').firstChild;
      editor.composer.selection.selectNode(node);
      editor.composer.commands.exec('formatBlock', "h1");
      equal(editableElement.innerHTML.toLowerCase(), '<h1 class="wysiwyg-text-align-left">once upon a time</h1><br>there was an unformated text<br>spanning many lines.', "Alignment div changed to heading ok");
      
      editor.composer.commands.exec('justifyRight');
      editor.composer.commands.exec('formatBlock', "h1");
      editor.composer.commands.exec('justifyRight');
      equal(editableElement.innerHTML.toLowerCase(), '<h1>once upon a time</h1><br>there was an unformated text<br>spanning many lines.', "heading alignment removed sucessfully");

      editor.composer.commands.exec('alignRightStyle');
      editor.composer.commands.exec('alignRightStyle');
      equal(editableElement.innerHTML.toLowerCase(), '<h1>once upon a time</h1><br>there was an unformated text<br>spanning many lines.', "heading alignment with style removed sucessfully");        
      editor.composer.commands.exec('formatBlock', "p");
      equal(editableElement.innerHTML.toLowerCase(), '<p>once upon a time</p><br>there was an unformated text<br>spanning many lines.', "heading changed to paragraph");

      // Tests covering multiple block elements

      prepareMutipleBlocks();
      editor.composer.commands.exec('formatBlock', "h2");
      equal(editableElement.innerHTML.toLowerCase(), '<h2>once upon a time</h2><h2>there was a formated text</h2>spanning many lines.', "Two block elements changed to heading 2");

      prepareMutipleBlocks();
      editor.composer.commands.exec('formatBlock', null);
      equal(editableElement.innerHTML.toLowerCase(), 'once upon a time<br>there was a formated text<br>spanning many lines.', "Two block elements removed");

      prepareMutipleBlocks(true);
      editor.composer.commands.exec('formatBlock', "h2");
      equal(editableElement.innerHTML.toLowerCase(), '<h1>once </h1><h2>upon a time</h2><h2>there</h2><p> was a formated text</p>spanning many lines.', "Selection covering 2 blocks escaped to heading 2");

      prepareMutipleBlocks(true);
      editor.composer.commands.exec('formatBlock');
      equal(editableElement.innerHTML.toLowerCase(), '<h1>once </h1>upon a time<br>there<br><p> was a formated text</p>spanning many lines.', "Format removed from Selection covering 2 blocks");

      prepareMutipleBlocks(true);
      editor.composer.commands.exec('formatBlock', "h1");
      editor.composer.commands.exec('formatBlock', "h2");
      equal(editableElement.innerHTML.toLowerCase(), '<h1>once </h1><h2>upon a time</h2><h2>there</h2><p> was a formated text</p>spanning many lines.', "Selection covering multiple blocks preserved fot subsequent modifications");

      start();
    });
  });
  
  // formatblock (alignment, headings, paragraph, pre, blockquote)
  asyncTest("Format block nesting", function() {
     expect(1);
    var that = this,
        parserRules = {
            tags: {
              h1: true,
              h2: true,
              p: true,
              div: true,
              br: true,
              ul: true,
              li: true
            }
          },
        editor = new wysihtml5.Editor(this.editableArea1, {
          parserRules: parserRules
        });
      
    editor.on("load", function() {
      var editableElement   = that.editableArea1;
      editor.setValue("<ul><li>row1</li><li>row2</li><li>row3</li></ul>", true);
      editor.composer.selection.selectNode(editor.editableElement.querySelectorAll('li')[1]);
      editor.composer.commands.exec('formatBlock', "h1");
      equal(editableElement.innerHTML.toLowerCase(), '"<ul><li>row1</li><li><h1>row2</h1></li><li>row3</li></ul>"', "Block element insserted into a correct place");
      start();
    });
  });
  
  // create blockQuote
  asyncTest("Create blockquote", function() {
    expect(4);
    var that = this,
      editor = new wysihtml5.Editor(this.editableArea1, {
        parserRules: {
          tags: {
            h1: true,
            p: true,
            blockquote: true
          }
        }
      }),
      text = "<h1>heading</h1><p>text</p>",
      text2 = "test<h1>heading</h1>test";

    editor.on("load", function() {
      var editableElement   = that.editableArea1;

      editor.setValue(text, true);

      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('insertBlockQuote');
      equal(editableElement.innerHTML.toLowerCase(), "<blockquote>" + text + "</blockquote>" , "Blockquote created with headings and paragraphs preserved.");

      editor.composer.commands.exec('insertBlockQuote');
      equal(editableElement.innerHTML.toLowerCase(), text, "Blockquote removed with headings and paragraphs preserved.");


      editor.setValue(text2, true);
      editor.composer.selection.selectNode(editor.editableElement.querySelector('h1'));
      editor.composer.commands.exec('insertBlockQuote');
      equal(editableElement.innerHTML.toLowerCase(), "test<blockquote><h1>heading</h1></blockquote>test" , "Blockquote created.");

      editor.composer.commands.exec('insertBlockQuote');
      equal(editableElement.innerHTML.toLowerCase(), "test<h1>heading</h1>test" , "Blockquote removed.");

      start();
    });
  });

}
