
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "redirectTo": "/users",
    "route": "/"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-P3Y5WVUU.js",
      "chunk-A2UPD7YJ.js",
      "chunk-M5GAIB2T.js"
    ],
    "route": "/users"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-BPKUIUMH.js",
      "chunk-A2UPD7YJ.js",
      "chunk-UZSWIHD3.js",
      "chunk-M5GAIB2T.js"
    ],
    "route": "/tasks"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-JSVVUCSN.js",
      "chunk-UZSWIHD3.js",
      "chunk-M5GAIB2T.js"
    ],
    "route": "/tasks/*"
  },
  {
    "renderMode": 1,
    "redirectTo": "/users",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 9739, hash: 'a894ec0598c52ec64414d6a8f8e423ab3a5f9e58a07d1c00f91ce4efd8b73af2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 997, hash: 'a6241bca33e70874cae584f24627dd4c53ce6297cb9eea4faa4f63b7528ab51f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-MMEMV42Y.css': {size: 25587, hash: 'OYXOuIqkSbY', text: () => import('./assets-chunks/styles-MMEMV42Y_css.mjs').then(m => m.default)}
  },
};
