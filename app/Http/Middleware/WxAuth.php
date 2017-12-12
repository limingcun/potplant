<?php
/**
 * auther:李明村
 * date: 2017/12/12
 */
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Model\User;
use Session;

class WxAuth {
    // 微信用户登录及权限 中间件
    public function handle($request, Closure $next) {
        // 微信登录状态判断
        $st = Session::get('st');
        if (!isset($request->st)) {
            return response()->json('notlogin', 401);
        } else if($request->st != $st) {
            return response()->json('expired', 403);
        }
        return $next($request);
    }
}
