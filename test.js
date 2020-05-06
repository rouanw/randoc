var test = require('tape');
var randoc = require('./randoc');

test('random document', function (t) {
  t.plan(10);

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
    profession: {
      _type: 'profession',
      args: { rank: false },
      _arrayOf: 3,
    },
    favouriteDinosaur: 'dinosaur',
    foodAllergies: { _type: 'allergies', _arrayOf: 2 },
  };

  const randomDocument = randoc.randomDocument(schema);

  t.ok(randomDocument.name.first);
  t.ok(randomDocument.name.last);
  t.equal(typeof randomDocument.vegan, 'boolean');
  t.ok(schema.jobTitle.options.includes(randomDocument.jobTitle));
  t.ok(randomDocument.friends[0].name.first);
  t.ok(randomDocument.friends[0].name.last);
  t.equal(randomDocument.profession.length, 3);
  t.equal(typeof randomDocument.favouriteDinosaur, 'string');
  t.equal(randomDocument.foodAllergies.length, 1);
  t.equal(typeof randomDocument.foodAllergies[0], 'string');

  t.end();
});

test('random documents', function (t) {
  t.plan(1);
  const randomDocuments = randoc.randomDocuments({}, 10);
  t.equal(randomDocuments.length, 10);
  t.end();
});
