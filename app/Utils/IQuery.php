<?php 
/**
 * desc: 工具类
 * autoer: limingcun
 * date: 2017/09/14
 */
namespace App\Utils;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;

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
}