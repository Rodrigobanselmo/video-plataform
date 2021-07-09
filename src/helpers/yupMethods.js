export function isUnique(message) {
  return this.test("isUnique", message, function (value,schema) {
    const { path, createError } = this;

    // console.log('value',value)
    // console.log('schema',schema.parent)
    const array = []
    const isRepeated = []

    Object.keys(schema.parent).map(key=>{
      if (array.includes(schema.parent[key]))  isRepeated.push(schema.parent[key])
      if (schema.parent[key]) array.push(schema.parent[key])
    })

    // console.log(isRepeated)
    if (isRepeated.length>0) {
      console.log('isRepeated',isRepeated.includes(value))
      if (isRepeated.includes(value)) return createError({ path, message: message ?? 'email duplicado' });
    }

    return true;
  });
}
