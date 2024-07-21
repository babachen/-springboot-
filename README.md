# 基于springboot的助农服务app

#### 介绍
2024届软件工程毕业设计

		该项目是基于springboot的助农App的设计及实现，主要实现了管理员，用户，商家三个端的设计，其中主要实现的功能有产品模块，订单模块，购物车模块，以及相关联的管理模块，秒杀等，帮助农民出售农作物，提高农业水平的发展，提高农民的收入，方便农民出售自产的农产品。系统使用MVC设计模式，用户端以及商家端采用uniapp+springboot+mybatis+mybatis-plus实现，后台管理系统采用vue+springboot+mybatis+mybatis-plus实现。数据存储使用mysql数据库，同时使用elasticSearch全文搜索，加快和前端交互的效率。

​		管理员端页面效果图如下，其中权限管理中使用了springsecurity框架，作为动态权限。各个表单的添加和修改功能均测试过，无任何问题。

![image-20240719172639860](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172639860.png)

![image-20240719172724534](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172724534.png)

![image-20240719172750505](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172750505.png)

![image-20240719172816237](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172816237.png)

![image-20240719172834076](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172834076.png)

![image-20240719172902706](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172902706.png)

![image-20240719172944577](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719172944577.png)

![image-20240719173021873](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173021873.png)

![image-20240719173042078](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173042078.png)

![image-20240719173105167](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173105167.png)

![image-20240719173135890](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173135890.png)

![image-20240719173158674](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173158674.png)

![image-20240719173243927](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240719173243927.png)

![img](file:///C:/Users/Administrator/AppData/Roaming/Tencent/Users/491650652/QQ/WinTemp/RichOle/{6$AZ@82F@M685V2X@6]}}D.png)

![image-20240721214832268](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721214832268.png)

![image-20240721214902277](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721214902277.png)

用户端页面如下图所示，采用的是app的形式展示，使用Hbuilder作为开发工具开发，个人觉得uniapp的语法和vue的语法极其相似=_=

用户端有秒杀的功能，使用了redis缓存秒杀数据，同时使用了rabbitmq作为消息队列。在首页的推荐中，使用的是基于物品的协同过滤算法。

登录页面包括用户名密码登录和邮箱验证码登录，邮箱验证码使用到的是springmail技术。

![image-20240721215856378](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721215856378.png)



![image-20240721220019814](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220019814.png)

![image-20240721220322932](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220322932.png)

![image-20240721220344228](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220344228.png)

![image-20240721220617122](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220617122.png)

![image-20240721220643111](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220643111.png)

![image-20240721220835056](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220835056.png)

![image-20240721220915900](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220915900.png)

![image-20240721220934903](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721220934903.png)

![image-20240721221015799](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221015799.png)

![image-20240721221031563](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221031563.png)

![image-20240721221047033](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221047033.png)

![image-20240721221059239](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221059239.png)

![image-20240721221113589](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221113589.png)

![image-20240721221140338](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221140338.png)

![image-20240721221150936](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221150936.png)

![image-20240721221202793](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221202793.png)

![image-20240721221410852](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221410852.png)

![image-20240721221432414](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721221432414.png)

以上是用户端买家的各个功能的部分截图，时间原因不一一阐述。

最后是商家端App，商家端App主要功能有数据台查看，店铺管理，商品管理，订单管理，以及参加秒杀活动的管理。商家端效果图如下所示。

![image-20240721230018188](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230018188.png)

![image-20240721230036704](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230036704.png)

![image-20240721230100668](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230100668.png)

![image-20240721230114601](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230114601.png)

![image-20240721230136099](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230136099.png)

![image-20240721230152791](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230152791.png)

![image-20240721230210599](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230210599.png)

![image-20240721230222368](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230222368.png)

![image-20240721230237368](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230237368.png)

![image-20240721230301008](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230301008.png)

![image-20240721230318840](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230318840.png)

![image-20240721230332262](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230332262.png)

![image-20240721230418729](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230418729.png)

![image-20240721230626159](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230626159.png)

![image-20240721230638603](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721230638603.png)

​		以上是基于Springboot的助农服务项目的介绍，运用到的技术和技术栈主要有springboot、mybaits、mybatisplus、redis、rabbitmq、elasticsearch、springsecurity、jwt令牌、springmail等等，同时自定义了一个基于物品的协同过滤算法，给用户做推荐。数据库使用的是mysql数据库，表设计有26张。

​		以上项目是本人自己设计编写的，如需源码请联系微信：wsjcql

![image-20240721235415548](https://gitee.com/chenqinli123/farm/raw/master/images/image-20240721235415548.png)
