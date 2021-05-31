# d2l-activity-alignments

[![CI][CI Badge]][CI Workflows]

## Components

- [Activity Alignments](#activity-alignments)
- [Activity Alignments Tags](#activity-alignment-tags)
- [Activity Alignments Tags (Read Only)](#activity-alignment-tags-read-only)

## Activity Alignments

### Usage

```html
<d2l-activity-alignments
  href="<copy from quad site>"
  token="<copy from quad site>">
</d2l-activity-alignments>
```

## Activity Alignment Tags

### Usage

```html
<d2l-activity-alignment-tags
  id="my-alignments"
  href="<activity usage URL>"
  token="<auth token>"
  title="<title that represents the entire tag list>"
  type-name="<name you want associated with the type of each tag item>"
></d2l-activity-alignment-tags>

<script>
document
  .getElementById( 'my-alignments' )
  .addEventListener( 'd2l-activity-alignment-tags-update', event => {
    const sirenAction = event.sirenAction;
    ...
  });
</script>
```

## Activity Alignment Tags (Read Only)

### Usage

```html
<d2l-activity-alignment-tags
  href="<activity usage URL>"
  token="<auth token>"
  title="<title that represents the entire tag list>"
  type-name="<name you want associated with the type of each tag item>"
  read-only
></d2l-activity-alignment-tags>
```

## Developing

After cloning the repo, run `npm install` to install dependencies.

### Running the Demos

Start local dev server that hosts the demo pages.

```sh
npm run serve:local
```

### Linting

```sh
# eslint, polymer lint and messageformat-validator
npm run lint

# eslint only
npm run lint:eslint

# polymer lint only
npm run lint:polymer

# messageformat-validator only
npm run lint:lang
```

### Formatting

```sh
# eslint and messageformat-validator
npm run format

# eslint only
npm run format:eslint

# messageformat-validator only
npm run format:lang
```

### Testing

```sh
# unit tests
npm test
```

### Adding/Updating Lang Term

1. Add the new term to `/lang/en.js`.
2. Run `npm run format`, this will add any new terms to all other languages and
   remove any terms not in `/lang/en.js` from all other languages.
3. Manually add french translations to `/lang/fr.js`.
   * Google translate. This is in case auto-translations don't run in time, if
     we don't have french, we can get fined.

### Versioning & Releasing

Run `npm version --no-git-tag-version [major | minor | patch]` in project
root directory, selecting the appropriate version increase type. This will bump
the version in both `package.json` and `package-lock.json` and leave it in your
working changes. Once checking this in and it being merged to `master` create
a GitHub release matching the version in the `package.json`.

<!-- links -->
[CI Badge]: https://github.com/Brightspace/d2l-activity-alignments/workflows/CI/badge.svg?branch=master
[CI Workflows]: https://github.com/Brightspace/d2l-activity-alignments/actions?query=workflow%3ACI+branch%3Amaster
