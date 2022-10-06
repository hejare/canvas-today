# Smart contracts:

Some notes in on-sorted order:

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
Mina an asset from NFT_CONTRACT_ADDRESS to given address

```
yarn hardhat mint --address [RECEIVER-ADDRESS]
```
