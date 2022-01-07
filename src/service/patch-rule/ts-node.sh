###
 # @Author       : Chengxin Sun
 # @Date         : 2021-12-04 18:08:36
 # @LastEditors  : Chengxin Sun
 # @LastEditTime : 2022-01-07 09:16:33
 # @Description  : Do not edit
 # @FilePath     : /express/src/service/patch-rule/ts-node.sh
 # @github-name  : scxmonkeyas
### 

rulenumber=4040 #总规则数目
intervalminute=20
patch=$((24*60/intervalminute))

patch_rule_number=$((rulenumber/patch))
echo "每次执行的规则数:"$((patch_rule_number))
# hour=$(date "+%k") #今天第几点m小时（1…23）
hour=$(date "+%H") #今天小时（00…23）
echo "当前小时数:"$hour
minute=$(date "+%M")
echo "当前分钟数:"$minute
second=$(date "+%S")
# echo "当前秒数:"$second
usetime=$((hour*60+minute))
# echo "use time:"$usetime"min"
cur_patch=$((usetime/intervalminute))
echo "一天一共执行次数:"$patch
echo "当前执行次数:"$cur_patch
rule_index=$((usetime/intervalminute*patch_rule_number))
# echo "当前规则索引:["$rule_index","$((rule_index+patch_rule_number))")"
# time2=$(date "+%Y%m%d%H%M%S")
# echo $time2
# cur_sec=`date '+%s'` #获取当前时间戳(s)
ts-node ../../main/index_patch.ts $patch $((cur_patch+1)) $rulenumber