# install

### dev
修改vue.config.js中的链接 


### prod
线上使用nginx代理方案,npm run build编译出dist，   
1.修改提交路径   src/config/index.js 中prod值
2.需要配置nginx
```
   root /www/wwwroot/vip.dibaozg.cn/dist;
  
   location  ^~ /user {
       proxy_set_header X-Scheme $scheme;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header Host $http_host;
       proxy_redirect off;
       proxy_pass http://127.0.0.1:89;
   }
   location / {
        try_files $uri $uri/ /index.html?$query_string;
    }
```
