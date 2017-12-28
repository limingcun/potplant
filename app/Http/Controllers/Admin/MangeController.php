<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use IQuery;
use DB;

class MangeController extends Controller
{
    /*
     * 盆栽操作列表数据
     * params:[plant_id:盆栽id,startDate:开始时间,endDate:结束时间,page:分页]
     */
    public function index(Request $request) {
        $plant_id = IQuery::cleanInput($request->plant_id);
        $user = User::join('plant_users','users.id','plant_users.user_id')
                    ->where('plant_users.plant_id',$plant_id);
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $user = $user->orderBy('users.created_at', 'desc')
                     ->select('users.id','users.real_name', 'users.img', 'users.openid', 'users.created_at', 'plant_users.type','plant_users.id as puid')
                     ->paginate(config('app.page'));
        return response()->json($user);
    }
    
    /*
     * 编辑盆栽列表数据
     * id:列表id数据
     */
    public function edit($id) {
        $user = User::find($id);
        return response()->json($user);
    }
    
    /*
     * 删除盆栽操作列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $operate = PlantUser::find($id);
        IQuery::delMosImg($operate->img);
        if($operate->delete()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
    
    /*
     * 编辑保存
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'real_name' => 'required',
            'sex' => 'required'
        ]);
        $model = Operate::find($id);
        $arr = ['real_name', 'age', 'sex', 'img', 'address', 'email', 'phone'];
        $model->setRawAttributes($request->only($arr));
        if ($model->save()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
}