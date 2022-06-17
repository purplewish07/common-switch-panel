## Advantech Common Switch Panel

### fix Advantech Common Switch Panel by Shaun 2022/06/14
Try to fix setTime bug.
Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss


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
