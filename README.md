## Docker Dev Command

```
PWD=`pwd` && docker run -p 8888:80 -v $PWD:/app -v /tmp:/tmp fontman
```