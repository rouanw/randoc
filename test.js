var test = require('tape');
var randoc = require('./randoc');

test('random document', function (t) {
  t.plan(13);

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
    cities: { _type: 'city', _array: true },
    emailAddresses: { _type: 'email', _array: { empty: 50 } },
    profession: {
      _type: 'profession',
      args: { rank: false },
      _array: { length: 3 },
    },
    favouriteDinosaur: 'dinosaur',
    foodAllergies: { _type: 'allergies', _array: true },
  };

  const randomDocument = randoc.randomDocument(schema);

  t.ok(randomDocument.name.first);
  t.ok(randomDocument.name.last);
  t.equal(typeof randomDocument.vegan, 'boolean');
  t.ok(schema.jobTitle.options.includes(randomDocument.jobTitle));
  t.ok(randomDocument.friends[0].name.first);
  t.ok(randomDocument.friends[0].name.last);
  t.equal(randomDocument.cities.length, 1);
  t.equal(typeof randomDocument.emailAddresses.length, 'number');
  t.ok(randomDocument.emailAddresses.length <= 1);
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
