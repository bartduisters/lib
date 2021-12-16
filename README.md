[![npm version](https://badge.fury.io/js/sveltekit-i18n.svg)](https://badge.fury.io/js/sveltekit-i18n) ![](https://github.com/jarda-svoboda/sveltekit-i18n/workflows/CI/badge.svg)

# sveltekit-i18n
`sveltekit-i18n` is a tiny, dependency-less library built for [Svelte](https://github.com/sveltejs/svelte) and [SvelteKit](https://github.com/sveltejs/kit).

___NOTE: This project is currently in beta as long as tests are missing. Also API may vary until 1.0.0 is released...___

## Key features

✅ Simple API\
✅ SvelteKit ready\
✅ SSR support\
✅ Custom data sources – no matter if you are using local files or remote API to get your translations\
✅ Module-based – your translations are loaded only in time they are really needed (and only once!)\
✅ TS support\
✅ No dependencies

## TODO
- tests

## Usage

Setup `translations.js` in your lib folder...
```javascript
import i18n from 'sveltekit-i18n';

export const config = ({
  loaders: [
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./en/common.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'home',
      routes: ['/'],
      loader: async () => (
        await import('./en/home.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'about',
      routes: ['/about'],
      loader: async () => (
        await import('./en/about.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'common',
      loader: async () => (
        await import('./cs/common.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'home',
      routes: ['/'],
      loader: async () => (
        await import('./cs/home.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'about',
      routes: ['/about'],
      loader: async () => (
        await import('./cs/about.json')
      ).default,
    },
  ],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
```

...include your translations in `__layout.svelte`...

```svelte
<script context="module">
  import { loadTranslations } from '$lib/translations';

  export const load = async ({ page }) => {
    const { path } = page;

    const locale = 'en'; // get from cookie or user session...
    await loadTranslations(locale, path);

    return {};
  }
</script>
```

...and use your placeholders within pages and components.

```svelte
<script>
  import { t } from '$lib/translations';

  const pageName = 'This page is Home page!';
</script>

<div>
  <!-- you can use {{placeholders}} in your definitions -->
  <h2>{$t('common.page', { pageName })}</h2>
  <p>{$t('home.content')}</p>
</div>
```

## Examples
You can view examples [here](https://github.com/jarda-svoboda/sveltekit-i18n/tree/master/examples).

## Config

### `loaders`?: __Array<{ locale: string; key: string; loader: () => Promise<Record<any, any>>; routes?: Array<string | RegExp>; }>__

You can use `loaders` to define your asyncronous translation load. All loaded data are stored so loader is triggered only once – in case there is no previous version of the translation.
Each loader can include:

`locale`: __string__ – locale (e.g. `en`, `de`) which is this loader for.

`key`: __string__ – represents the translation module. This key is used as a translation prefix so it should be module-unique. You can access your translation later using `$t('key.yourTranslation')`. It shouldn't include `.` (dot) character.

`loader`:__() => Promise<Record<any, any>>__ – is a function returning a Promise with translation data. You can use it to load files locally, fetch it from your API etc...

`routes`?: __Array<string | RegExp>__ – can define routes this loader should be triggered for. You can use Regular expressions too. For example `[/\/.ome/]` will be triggered for `/home` and `/rome` route as well (but still only once). Leave this `undefined` in case you want to load this module with any route (useful for common translations).

### `initLocale`?: __string__
If you set this parameter, translations will be initialized immediately using this locale.


## Instance methods and properties

Each `sveltekit-i18n` instance includes these properties and methods:

`loading`: __Readable\<boolean>__ – this readable store indicates wheter translations are loading or not.

`initialized`: __Readable\<boolean>__ – this readable store returns `true` after first translation successfully initialized.

`locale`: __Writable\<string>__ – you can obtain and set current locale using this writable store.

`locales`: __Readable<string[]>__ – readable store, containing all instance locales.

`translations`: __Readable\<Translations>__ – readable store, containing all loaded translations.

`t`: __Readable<(key: string, vars?: Record<any, any>) => string>__ – this readable store returns a function you can use to obtain your translations for given translation key and interpolation variables.

`l`: __Readable<(locale: string, key: string, vars?: Record<any, any>) => string>__ – this readable store returns a function you can use to obtain your translations for given locale, translation key and interpolation variables.

`loadConfig`: __(config: Config) => Promise\<void>__ – you can load a new `config` using this method.

`loadTranslations`: __(locale: string, route?: string) => Promise\<void>__ – this method loads translation for given `locale` and `route`.

`addTranslations`: __(translations: Record<string, Record<string, any>>, keys?: Record<string, string[]> | undefined) => void__ – this method allows you to add your translations directly. 

- `translations` parameter should contain an object, containing translations objects for locales you want to add.

For example: 
```jsonc
{
  "en": {
    "common": {
      "title": "text"
    }
  }
}
```

or with dot notation:
```jsonc
{
  "en": {
    "common.text": "Enghlish text"
  },
  "es": {
    "common.text": "Spanish text"
  }
}
```

- `keys` parameter should contain corresponding keys from your `loaders` config, so the translation is not loaded duplicitly in future. If `keys` are not provided, translation keys are taken automatically from the `translations` parameter as the first key (or value before the first dot in dot notation) under every locale.

For example, for the previous case it would be:
```jsonc
{
  "en": ["common"],
  "es": ["common"]
}
```