# 开发指令
```
yarn global add parcel@1.9.7
parcel src/index.html
```
# 部署到github：
```
parcel build src/index.html --no-minify --public-url ./
git add .
......
```

# 简化上述build命令：
```
yarn init -y
package.json里添加：
"scripts":{
  "build": "rm -rf dist && parcel build src/index.html --no-minify --public-url ./"
}
然后就能一键yarn build部署：
yarn build
git add .
......
```
