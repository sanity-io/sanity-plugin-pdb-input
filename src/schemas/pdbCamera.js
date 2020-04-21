export default {
  name: 'camera',
  title: 'camera',
  type: 'object',
  fields: [
    {
      name: 'rotation',
      type: 'array',
      of: [{type: 'number'}]
    },
    {
      name: 'center',
      type: 'array',
      of: [{type: 'number'}]
    },
    {
      name: 'zoom',
      type: 'number'
    }
  ]
}
