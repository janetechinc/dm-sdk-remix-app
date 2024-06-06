# DM SDK SSR/CSR API PoC

This app is a proof of concept for a couple of ideas on how to unite the CSR and the SSR APIs of the DM SDK.

1. How to allow attribution handlers (click, impress) with the SSR ads. We wrapped the ad info into a class that has click and impression handlers, (de)serialize that class instance to pass it form server state to client state. This allows the same Ad class to be used in both SSR and CSR as long as it's reconstructed with the same values.
2. How to handle JDID in SSR, since we can't store it in localStorage. We provide a cookie that the roots partner must set in their SSR response, and then read that cookie to get the JDID in future requests.

We still need to come up with a way to ensure that roots partners actually set the cookie we provide, since this PoC only *allows* them to do so but doesn't *require* it.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.
