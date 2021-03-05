# \<d2l-activity-alignments\>

[![CI][CI Badge]][CI Workflows]

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```
The demo can be viewed at http://127.0.0.1:8081/components/d2l-activity-alignments/demo/

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

### Test with LMS API

1. Comment out request-mock.js in the demo/index.html
  * `<script type="module" src="./request-mock.js"></script>`

2. Import the required module
  * For example: `<script type="module" src="../d2l-alignment-list.js"></script>`

3. Get href and token from quad site for the module you want to test, by insepcting element using F12(chrome)

4. Have fun testing

### Display d2l-activity-alignments

```html
<script type="module" src="../d2l-alignment-alignments.js"></script>

<demo-snippet>
  <template>
    <d2l-activity-alignments href="<copy from quad site>" token="<copy from quad site>"></d2l-activity-alignments>
  </template>
</demo-snippet>
```

### Display outcome alignments in tag view

#### Read-Only View

```html
<d2l-activity-alignment-tags
  href="<activity usage URL>"
  token="<auth token>"
  title="<title that represents the entire tag list>"
  type-name="<name you want associated with the type of each tag item>"
  read-only
></d2l-activity-alignment-tags>
```

#### Editable View

```html
<d2l-activity-alignment-tags
  id="my-alignments"
  href="<activity usage URL>"
  token="<auth token>"
  title="<title that represents the entire tag list>"
  type-name="<name you want associated with the type of each tag item>"
></d2l-activity-alignment-tags>

<script>
document.getElementById( 'my-alignments' ).addEventListener( 'd2l-activity-alignment-tags-update', function( event ) {
  var sirenAction = event.sirenAction;
  // Event fired when the Add button is clicked
  // ...
});
</script>
```

## Lang Term Update

#### Adding an new lang term

 1. Add the new term to `/lang/en.json`
 2. Run `npm run lang:copy` (this will copy term to other files)
 3. Manually add french translations to `/lang/fr.json` (google translate. This is in case auto-translations don't run in time, if we don't have french, we can get fined)
 4. Run `npm run lang:build`
 5. Run `npm run lang:lint -- --fix`

#### Modifying a lang term

 1. Modify the term in `/lang/en.json`
 2. Run `npm run lang:copy -- term1 term2...` (where `term1,term2` are the terms you'd like to modify).
 3. Manually modify french translations to `/lang/fr.json`
 4. Run `npm run lang:build`
 5. Run `npm run lang:lint -- --fix`

<!-- links -->
[CI Badge]: https://github.com/Brightspace/d2l-activity-alignments/workflows/CI/badge.svg?branch=master
[CI Workflows]: https://github.com/Brightspace/d2l-activity-alignments/actions?query=workflow%3ACI+branch%3Amaster
