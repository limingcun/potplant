<?php 
/**
 * desc: 工具类
 * autoer: limingcun
 * date: 2017/09/14
 */
namespace App\Utils;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redis;
use App\User;

class IQuery{
     /**
     ** 净化表单插入数据
     ** $input表单传入值
     **/
    function cleanInput($input){
        $clean = preg_replace('/\W/','',$input);
        return $clean;
    }
    
    /**
     ** 图片存储工具
     ** $request传入值, $name图片名，$con存储目录，$pre图片名称前缀
     **/
    public function setImg($request, $name, $con, $pre) {
        if ($request->hasFile($name)) {
            $file = $request->file($name);
            $path = $con;
            $Extension = $file->getClientOriginalExtension();
            $filename = $pre.rand(1000,9999).time().'.'. $Extension;
            $check = $file->move($path, $filename);
            $filePath = $path.$filename; //原图路径加名称
            $pic= $filePath;//原图
            return $pic;
        }
    }
    
    /*
     * 获取redis中get值
     * $key键值
     */
    public function redisGet($key) {
        $value = Redis::get(config('app.redis_pre').'_'.$key);
        $value_serl = @unserialize($value);
        if(is_object($value_serl)||is_array($value_serl)){
            return $value_serl;
        }
        return $value;
    }

    /*
     * 设置redis键值
     * $key键,$val值
     */
    public function redisSet($key, $val, $time) {
        if(is_object($val)||is_array($val)){
            $val = serialize($val);
        }
        if (isset($time)) {
            $resTime = $time;
        } else {
            $resTime = config('app.redis_time');
        }
        Redis::setex(config('app.redis_pre').'_'.$key, $resTime, $val);
    }
    
    /*
     * 根据openid获取用户信息
     * $openid 微信id
     */
    public function getAuthUser($openid) {
        $user = User::where('openid',$openid)->first();
        return $user;
    }
    
    /*
     * 删除图片
     * $imgs一张图片路径或多张图片路径组合的字符串
     */
    public function delMosImg($imgs) {
        $imgs = explode(',', $imgs);
        foreach($imgs as $img) {
            $img = str_replace("\\","/",public_path().'/'.($img));
            if (is_file($img)) unlink($img);
        }
    }
    
    /*
     * 字符串转换为数组
     * $params 字符串
     */
    public function changeType($params) {
        $arr=Array();
        if(!is_array($params)) {
            $params = $this->delStr($params,'{','}');
            $params = explode(',',$params);
            foreach($params as $param) {
                $param = explode(':',$param);
                $param[0] = $this->delStr($param[0],'\"','\"');
                $param[1] = $this->delStr($param[1],'\"','\"');
                $arr[$param[0]]=$param[1];
            }
            return $arr;
        }
        return $params;
    }
    
    //去掉两端字符串
    public function delStr($params,$left,$right) {
        $params = ltrim($params,$left);
        $params = rtrim($params,$right);
        return $params;
    }
}