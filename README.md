## Advantech Common Switch Panel

### fix Known security vulnerabilities detected
Dependency
babel-traverse	Version < 7.23.2 Upgrade to ^7.23.2
braces	Version < 3.0.3	Upgrade to ~ ^3.0.3
micromatch	Version < 4.0.8	Upgrade to ^4.0.8

### fix Advantech Common Switch Panel by Shaun 2022/06/14
Try to fix setTime bug.
Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss(ISO 8601 format)

### Building


To install packages
```
npm install -g yarn
yarn install
```

To lint everything:

```
yarn pretty
```

To complie, run:
```
grunt
```