## Advantech Common Switch Panel

### fix Advantech Common Switch Panel by Shaun 2022/06/14
Try to fix setTime bug.
Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss(ISO 8601 format)


### Building


To install packages
```
npm install -g yarn
yarn install --pure-lockfile
```

To lint everything:

```
yarn pretty
```

To complie, run:
```
grunt
```