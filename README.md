## rebuild Advantech Common Switch Panel
Try to rebuild and fix select time bug.
Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss

## Advantech Common Switch Panel
### Building

To complie, run:

```
npm install -g yarn
yarn install --pure-lockfile
grunt
```

To lint everything:

```
yarn pretty
