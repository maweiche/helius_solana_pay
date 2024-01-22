# Simple Solana Pay Front-End using QR Codes

This app uses the `@solana/pay` sdk to set up a storefront to accept payment. This app is a simple Next.JS/React app that will allow you to accept payment in SOL via QR Code. This build can be implemented for IRL stores or for your online store, allowing customers to pay without having to connect their wallet.

Big shoutout to [Callum McIntyre](https://twitter.com/callum_codes), a lot of the code snippets are based on his open-source work.

**Storefront**
![helius-store-with-products](https://hackmd.io/_uploads/SkKHtl2u6.png)

**QR Code**
![QR Code](https://hackmd.io/_uploads/BkcYW6stT.png)

**Wallet Txn**
![helius-store-txn](https://hackmd.io/_uploads/HJHLzXn_p.png)

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev` to start the app
4. Adjust products listed in in the `lib/products.ts` to display your products

```ts
export const products = [
    {
      id: 'bear',
      name: 'Mert Bear',
      description: 'A stuffed and snuggly Mert Bear',
      imageUrl: 'https://black-historic-harrier-585.mypinata.cloud/ipfs/QmZbv3bmXUYiqmf4k85t9H1sr2roedzLN4sLxPrqkgZgwU?_gl=1*1dsyikz*_ga*OTY0MTU1NTY1LjE3MDQ4ODA5NTA.*_ga_5RMPXG14TE*MTcwNDg4MDk0OS4xLjEuMTcwNDg4MTA3NC4yNC4wLjA.',
      priceSol: 0.05,
    },
    {
      id: 'crab',
      name: 'Mert Crab',
      description: 'A glass chewing Mert Crab',
      imageUrl: 'https://black-historic-harrier-585.mypinata.cloud/ipfs/QmWQeDAT8RDVH4JbaZMngMEZb5rMAEbhtH9hAZHGzEJiwE?_gl=1*1giwok2*_ga*OTY0MTU1NTY1LjE3MDQ4ODA5NTA.*_ga_5RMPXG14TE*MTcwNDg4MDk0OS4xLjEuMTcwNDg4MTA4NC4xNC4wLjA.',
      priceSol: 0.1,
    }
  ]
```

