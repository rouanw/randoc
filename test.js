var test = require('tape');
var dataGen = require('./data-gen');

test('random document', function (t) {
  t.plan(6);

  const schema = {
    name: {
      first: 'first',
      last: 'last',
    },
    vegan: 'bool',
    birthday: 'date',
    jobTitle: {
      _type: 'enum',
      options: ['software developer', 'football player'],
    },
    friends: [{
      name: {
        first: 'first',
        last: 'last',
      },
    }],
  };

  const randomDocument = dataGen.randomDocument(schema);

  t.ok(randomDocument.name.first);
  t.ok(randomDocument.name.last);
  t.equal(typeof randomDocument.vegan, 'boolean');
  t.ok(schema.jobTitle.options.includes(randomDocument.jobTitle));
  t.ok(randomDocument.friends[0].name.first);
  t.ok(randomDocument.friends[0].name.last);

  t.end();
});

test('random documents', function (t) {
  t.plan(1);
  const randomDocuments = dataGen.randomDocuments({}, 10);
  t.equal(randomDocuments.length, 10);
  t.end();
});
