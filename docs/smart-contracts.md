# Smart contracts:

1. build NFT meta data with image and such, put it on the IPFS network whcih then will result in a CID and builds up the "base-url" used when calling "set-base-token-uri"
2. mint: this takes the reciever address. It depends internally on the contract address (via getContract helper).
  -> so... having the counter here, will interefere with ALL other minting -> reste counter per day?
to be continued...



## Some notes in un-sorted order:

### Compile the scripts:
_(Dont forget to run this when making changes in `hardhat.config.js` !)_
```
yarn hardhat compile				
```

### Deploy _the_ smart contract:
...and as you might guess, the network argument sets which network we deploy to.
```
yarn hardhat run scripts/deploy.js --network goerli
```

### Check balance:
```
yarn hardhat check-balance
```


### Mint an asset:
Mint an asset from NFT_CONTRACT_ADDRESS to given address

```
yarn hardhat mint --address [RECEIVER-ADDRESS]
```
