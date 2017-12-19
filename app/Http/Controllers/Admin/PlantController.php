<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Plant;
use IQuery;

class PlantController extends Controller
{
    /*
     * 盆栽列表数据
     * params:[openid:微信id,startDate:开始时间,endDate:结束时间,page:分页]
     */
    public function index(Request $request) {
        $openid = IQuery::cleanInput($request->openid);
        $plant = Plant::join('plant_users','plants.id','=','plant_users.plant_id')
                ->join('users','plant_users.user_id','=','users.id')
                ->where('users.openid',$openid);
        if(isset($request->startDate)) {
            $plant = $plant->where('plants.created_at','>=',$request->startDate);
        } 
        if(isset($request->endDate)) {
            $plant = $plant->where('plants.created_at','<=',$request->endDate);
        }
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $plant = $plant->orderBy('plants.created_at', 'desc')->select('plants.*')->paginate(config('app.page'));
        return response()->json($plant);
    }
    /*
     * 删除盆栽列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $plant = Plant::find($id);
        if($plant->delete()) {
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
            'name' => 'required',
            'intro' => 'required|max:2000',
            'img' => 'required'
        ]);
        if ($id == -1) {
            $model = new Plant;
        } else {
            $model = Plant::find($id);
        }
        $arr = ['intro', 'name', 'img'];
        $model->setRawAttributes($request->only($arr));
        
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
        $pic = IQuery::setImg($request,$img,'image/plant/','plt_');
        return $pic;
    }
}