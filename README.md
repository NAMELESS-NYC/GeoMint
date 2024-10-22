# Nameless Geo Claim

This repository contains demo contracts and applications for using geo location to mint tokens on the Aptos blockchain. This is an MVP version intended to be building blocks for production level features in the future.

## Subdirectories

- `app`: App for creating geo-fences on chain and tracking user checkins.

- `check-in-app`: App for checking in to a geo-location and viewing all checkin collectibles received.

- `contracts`: Move contracts for on_chain_geo_v1. Testnet contract can be found [here](https://explorer.aptoslabs.com/account/0x73aa6d84f37be89fd804376a78abd5e823f1811cc44ed5ad262759c9a72ce307/modules/code/on_chain_geo_v1/is_within_geo?network=testnet).

- `server`: Sample server for sending all mint transactions via a single private key. This is necessary if you use an admin wallet in your contract.

## Prerequisites

- Node.js (>= 14.x)

- npm (>= 6.x) or yarn (>= 1.x)

## Installation and Running

### Common Steps

1. Clone the repository:

```sh

git clone https://github.com/NAMELESS-NYC/geo-claim.git

cd on-chain-geo

```

### app

1. Navigate to the `app` directory:

```sh

cd app

```

2. Install dependencies:

```sh

npm install

# or

yarn install

```

3. Start the development server:

```sh

npm start

# or

yarn start

```

4. Open your browser and navigate to `http://localhost:3000`.

### check-in-app

1. Navigate to the `check-in-app` directory:

```sh

cd check-in-app

```

2. Install dependencies:

```sh

npm install

# or

yarn install

```

3. Start the development server:

```sh

npm start

# or

yarn start

```

4. Open your browser and navigate to `http://localhost:3001 (by default can be managed via .env)`.

### server

1. Navigate to the `server` directory:

```sh

cd check-in-app

```

2. Install dependencies:

```sh

npm install

# or

yarn install

```

3. Start the development server:

```sh

npm start

# or

yarn start

```

4. Open your browser and navigate to `http://localhost:3002 (by default can be managed via .env)`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
