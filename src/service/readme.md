<!--
 * @Author: your name
 * @Date: 2021-08-25 20:19:05
 * @LastEditTime: 2021-08-25 20:27:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\service\readme.md
-->

## 业务层（service）需要根据系统的实际业务需求进行逻辑代码的编写，有些业务逻辑需要通过与数据库交互的，则业务逻辑层需要调用数据访问层的相关方法实现与数据库的交互，对于一些不需要与数据库进行交互的，则直接编写业务代码，将执行结果反馈给控制层即可；

-   Service 被称作业务层。顾名思义，它处理逻辑上的业务，而不去考虑具体的实现。
-   为了使得我们在写代码的时候，不同的逻辑层内的代码之间的关联降低到最小，我们需要在不同的逻辑层之间加一些缓冲的层来达到一些解耦的效果。比如，你在视图层，不会直接去调用 Dao 层。
