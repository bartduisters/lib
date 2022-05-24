// eslint-disable-next-line import/extensions
import { defaultLocale, locales } from '$lib/translations';

const routeRegex = new RegExp(/^\/[^.]*([?#].*)?$/);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  const { url, request } = event;
  const { pathname, origin } = url;

  let eventToResolve = event;

  // If this request is a route request
  if (routeRegex.test(pathname)) {
    // Get defined locales
    const supportedLocales = locales.get();

    // Try to get locale from `pathname`.
    let locale = supportedLocales.find((l) => `${l}`.toLowerCase() === `${pathname.match(/[^/]+?(?=\/|$)/)}`.toLowerCase());

    // If route locale is not supported
    if (!locale) {
      // Set default locale if user preferred locale does not match
      locale = defaultLocale;

      const redirectTo = `${origin}/${locale}${pathname}`;

      const { headers } = request;

      eventToResolve = { request: new Request({ ...request, headers, url: redirectTo, body: null }), url: new URL(redirectTo) };

    }

    // Add html `lang` attribute
    return resolve(eventToResolve, {
      transformPage: ({ html }) => html.replace(/<html.*>/, `<html lang="${locale}">`),
    });
  }

  return resolve(eventToResolve);
};