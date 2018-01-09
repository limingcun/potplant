<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\PlantUser;
use IQuery;
use DB;

class ApplyController extends Controller
{
    /*
     * 用户申请列表列表数据
     * page页数
     */
    public function index(Request $request) {
        $list = User::where('type','!=',1);
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $list = $list->select('id','real_name','img','sex','address','phone','email','apply_state')
                      ->orderBy('id','desc')->paginate(config('app.page'));
        return response()->json($list);
    }
    
    /*
     * 删除盆栽操作列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $operate = PlantUser::find($id);
        if($operate->delete()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
    
    /*
     * 更改申请状态
     */
    public function changeState(Request $request) {
        $id = IQuery::cleanInput($request->id);
        $user = User::findOrFail($id);
        $user->apply_state = 1;
        if ($user->save()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
}