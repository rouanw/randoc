const chance = new require('chance')();

const defaultForUnknownField = ({ fieldName, type, array = false }) => {
  console.log(`No Chance.js generator found for field ${fieldName} of type ${type}. Using string instead.`);
  return { [fieldName]: array ? [chance.string()] : chance.string() };
}

const arrayField = ({ _type, _array, args }, fieldName) => {
  if (_array.empty && !chance.bool({ likelihood: _array.empty }) ) {
    return { [fieldName]: [] }
  }
  if (chance[_type]) {
    return { [fieldName]: [...new Array(_array.length || 1)].map(_ => chance[_type](args)) };
  } else {
    return defaultForUnknownField({ fieldName, type: _type, array: true });
  }
}

const specialRandomDocument = (fieldName, schema) => {
  if (schema._exists && !chance.bool({ likelihood: schema._exists }) ) {
    return {};
  }
  if (schema._array) {
    return arrayField(schema, fieldName);
  }
  if (schema._type === 'enum') {
    return { [fieldName]: chance.pickone(schema.options) };
  }
  if (chance[schema._type] && schema.args) {
    return { [fieldName]: chance[schema._type](schema.args) };
  }
  return defaultForUnknownField({ fieldName, type: schema._type });
};

const randomDocument = (fieldSchema) => Object.entries(fieldSchema).reduce((record, [fieldName, type]) => {
  if (Array.isArray(type)) {
    return Object.assign({}, record, { [fieldName]: [].concat(type.map(randomDocument)) });
  }
  if (typeof type === 'object' && type !== null) {
    return (type._type)
      ? Object.assign({}, record, specialRandomDocument(fieldName, type))
      : Object.assign({}, record, { [fieldName]: randomDocument(type) });
  }
  if (chance[type]) {
    return Object.assign({}, record, { [fieldName]: chance[type]() });
  }
  return Object.assign({}, record, defaultForUnknownField({ fieldName, type }));
}, {});

const randomDocuments = (schema, n) => [...Array(n)].map(() => randomDocument(schema));

module.exports = {
  randomDocument,
  randomDocuments,
};
