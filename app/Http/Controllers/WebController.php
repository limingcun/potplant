<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use IQuery;

class WebController extends Controller
{
    private $appid = 'wx2856a4698fa680ab'; // 小程序appid
    private $secret = 'fd66dbbfd4a9043eef5b0b8259d42b8e'; //密匙
    private $grant_type = 'authorization_code'; //固定值
    private $grant_type1 = 'client_credential';
    
    /*
     * 获取Openid
     * js_code登录获取js_code
     */
    public function getOpenid(Request $request) {
        $js_code = $request->js_code;
        $post_data = array();
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=';
        $url .= $this->appid.'&secret='.$this->secret.'&js_code='.$js_code.'&grant_type='.$this->grant_type;
        $postdata = http_build_query($post_data);  
        $options = array(  
            'http' => array(  
              'method' => 'GET',  
              'header' => 'Content-type:application/json',  
              'content' => $postdata,  
              'timeout' => 15 * 60 // 超时时间（单位:s）  
            )  
        );  
        $context = stream_context_create($options);  
        $result = file_get_contents($url, false, $context);
        return response()->json([
            'openid' => json_decode($result),
            'token' => csrf_token()
        ]);
    }
    
    /**
     ** 生成微信二维码
    **/
    public function setQrcode(Request $request) {
        $plant_Id = $request->id;
        if(is_file('image/qrcode/plant_qrcode_'.$plant_id)) {
            $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type='.$this->grant_type1.'&appid='.$this->appid.'&secret='.$this->secret;
            $res = file_get_contents($url);
            $res = IQuery::changeType($res);
            $access_token = $res['access_token'];
            $data = array('path' => $request->path);
            $data = json_encode($data);
            $url = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token='.$access_token;
            $options = array(
                'http' => array (
                    'method' => 'POST',
                    'header' => 'Content-type:application/json',
                    'content' => $data,
                    'timeout' => 15 * 60 // 超时时间（单位:s）
                )
            );
            $context = stream_context_create($options);
            $result = file_get_contents($url, false, $context);
            file_put_contents('image/qrcode/plant_qrcode_'.$plant_id,$result);
        }
        return response()->json('image/qrcode/plant_qrcode_'.$plant_id);
    }
}
