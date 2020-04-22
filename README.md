# Protein Data Bank Sanity Plugin

This is a plugin which adds an object type `protein` to your Sanity schema, and provides a custom input component to let you select a PDB protein model in a predefined list and adjust the starting camera position and zoom.

![](PDB.gif)

Not familiar with Sanity? [Visit www.sanity.io](https://www.sanity.io/)

## Quick start

- While in your project folder, run `sanity install pdb-input`.
  Read more about [using plugins in Sanity here](https://www.sanity.io/docs/plugins).

## Usage

Use it in your schema types:

```js
// [...]
{
  fields: [
    // [...]
    {
      name: "proteinModel",
      title: "A PDB 3d model",
      type: "protein",
    },
  ];
}
```

Note that the above only works if you import and use the `all:part:@sanity/base/schema-type` part in your schema. This is the most common way. If you are not importing the base types in this manner, you may import the `schemas/pdb.js` and `schemas/pdbCamera.js` and include them in your schema manually.

Read more about [schemas in Sanity here](https://www.sanity.io/docs/the-schema).

## Data model example

```js
{
  "_type": "protein",
  "camera": {
    "rotation": [
      0.4790152907371521,
      -0.8654894232749939,
      -0.14653077721595764,
      0,
      -0.14660295844078064,
      -0.24346202611923218,
      0.958766520023346,
      0,
      -0.8654779195785522,
      -0.43778201937675476,
      -0.24350611865520477,
      0,
      0,
      0,
      0,
      1
    ],
    "center": [
      -15.685999870300293,
      22.24799919128418,
      -6.605999946594238
    ],
    "zoom": 36.5915087377568
  },
  "pdb": "4HHB"
}
```

# Displaying the PDB models in your web frontend

This plugin uses the `bio-pv` node module to let the editor manipulate the camera settings. You may use the same library for displaying interactive PDB models in your web frontend. You can find it [here](https://www.npmjs.com/package/bio-pv)
