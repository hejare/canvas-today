# HRE (Hardhat Runtime Environment):

HRE is enables the handling of RPC calls (comunication with the blockchain) in two ways.

1. One way is to make calls via the terminal: 
This re-builds the hre with current configurations and linked scripts:
```
yarn hardhat compile
```

One can call a task defined in any of the linked scripts, and pass arguments like this (network is the custom argument in this case):
```
yarn hardhat check-balance --network goerli
```

If arguments in the task (the individual functions within the script file), are using camelCase, the arguments passed via terminal has to be kebab-case:
```
yarn hardhat estimate-add-art --network mumbai art-id 346482521126469833
```
2. A second way to use hre is in code by using the "run" function:
In this case, the arguments passed are in calelCase:
```
const balance = await run("check-balance", {
  networkName: "mumbai",
}); // reutrns Bignumber
```
