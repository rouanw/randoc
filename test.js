var test = require('tape');
var dataGen = require('./data-gen');

test('example record', function (t) {
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

  const exampleRecord = dataGen.exampleRecord(schema);

  t.ok(exampleRecord.name.first);
  t.ok(exampleRecord.name.last);
  t.equal(typeof exampleRecord.vegan, 'boolean');
  t.ok(schema.jobTitle.options.includes(exampleRecord.jobTitle));
  t.ok(exampleRecord.friends[0].name.first);
  t.ok(exampleRecord.friends[0].name.last);

  t.end();
});

test('example records', function (t) {
  t.plan(1);
  const exampleRecords = dataGen.exampleRecords({}, 10);
  t.equal(exampleRecords.length, 10);
  t.end();
});
