# Extend people-names with additional names:
This affects the filtering of whcih headlines that may be used. If any names are identified, we skip that headline due to possible violations.
For instance when presidents and such, needs to be added...

Modify this file:
`./node_modules/people-names/data/additional-names.json`

Then run the patch command in terminal:
```
./node_modules/.bin/patch-package people-names
```

This will add/update a apatch-file that is used during isntallation.
