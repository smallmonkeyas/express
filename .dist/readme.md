> 配置文件说明

- linked

```json
可选配置1：false，表明当前不需连接网络，本地运行即可，但前提是当前目录下要有相应的json文件，以供转为xlsx数据格式
可选配置2：true，表明当前需要连接网络，可执行文件会按照配置文件中的网络请求配置来请求获取数据并转为xlsx格式的文件
```

- request-collection

```json
数组格式存储，存储需要请求的集合，数组中的每个元素需要与配置文件中的键对应，程序会依据该数组中的元素来决定哪些是要发起请求的，依据该格式可进行相应的扩展
```

![image-20211018230950599](https://i.loli.net/2021/10/18/dzyMq6lSvAugLpQ.png)

- 各个具体请求的配置说明如下：

  - method

  ```json
  可选配置1：GET，向服务器发送get请求
  可选配置2：POST，向服务器发送post请求
  可选配置2：DELETE，向服务器发送delete请求
  ```

  - http-request-option

  ```json
  netAddress：接口网络地址
  netPath:接口路径
  netParam:接口参数
  ```

  ![image-20211018232929366](https://i.loli.net/2021/10/18/NrBZSUH54nKAcis.png)

  ### `注意：除了上面的三个参数，还有一个是netData，该参数对应于请求体(body)中的数据，一般取json数据,如下图所示`

  ![image-20211018233531936](https://i.loli.net/2021/10/18/NW4Sjg519IkqTGu.png)

  - http-request-return

  ```json
  templete：请求返回体的模板，程序会按照该模板决定应该选取哪层数据，并将该层数据转为xlsx格式的文件
  "date-set":当取到的json数据中某个字段的展示形式不是我们想要的时候，我们可以进行相应的转换配置，时间配置就是其中的一种，该配置下包括以下几种参数：
  ①enabled:决定是否需要转换时间，true=使能/false=不使能
  ②format:时间格式转换形式，"YYYY-MM-DD HH:mm:ss"表明我们希望时间类似“2021-01-01 01:01:01”的格式展示
  ③params:决定哪些字段是需要转换的，以数组形式存储各个字段
  ```

  - export

  ```json
  文件导出选项，如字面意思，较为简单，在此不再赘述
  ```

  