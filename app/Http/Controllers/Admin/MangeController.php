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
        $user = User::join('plant_users','users.id','plant_users.plant_id')
                    ->where('plant_users.plant_id',$plant_id);
        if(isset($request->startDate)) {
            $user = $user->where('users.created_at','>=',$request->startDate);
        } 
        if(isset($request->endDate)) {
            $user = $user->where('users.created_at','<=',$request->endDate);
        }
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $user = $user->orderBy('users.created_at', 'desc')->paginate(config('app.page'));
        return response()->json($user);
    }
    /*
     * 编辑盆栽列表数据
     * id:列表id数据
     */
    public function edit($id) {
        $operate = Operate::find($id);
        return response()->json($operate);
    }
    /*
     * 删除盆栽操作列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $operate = Operate::find($id);
        IQuery::delMosImg($operate->img);
        if($operate->delete()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
    
    /*
     * 新增保存
     */
    public function store(Request $request)
    {
        return $this->storeOrUpdate($request);
    }

    /*
     * 编辑保存
     */
    public function update(Request $request, $id)
    {
        return $this->storeOrUpdate($request, $id);
    }

    // 新建、编辑 保存方法
    public function storeOrUpdate(Request $request, $id = -1)
    {
        $this->validate($request, [
            'datetime' => 'required',
            'info' => 'required|max:2000'
        ]);
        if ($id == -1) {
            $model = new Operate;
        } else {
            $model = Operate::find($id);
        }
        $arr = ['info', 'datetime', 'img'];
        $model->setRawAttributes($request->only($arr));
        if ($id==-1) {
            $model->plant_id = IQuery::cleanInput($request->plant_id);
            $model->type = IQuery::cleanInput($request->type);
        }
        if ($model->save()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
    
    /*
     * 上传图片接口
     */
    public function uploadImg(Request $request)
    {
        $img = 'img';
        $pic = IQuery::setImg($request,$img,'image/opera/','opr_');
        return $pic;
    }
}