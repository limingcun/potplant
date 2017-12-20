<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Plant;
use IQuery;
use DB;
use App\PlantTab;
use App\PlantUser;

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
     * 编辑盆栽列表数据
     * id:列表id数据
     */
    public function edit($id) {
        $plant = Plant::find($id);
        $plant_tab = PlantTab::where('plant_id',$id)->get();
        return response()->json([
            'plant' => $plant,
            'plant_tab' => $plant_tab
        ]);
    }
    /*
     * 删除盆栽列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $plant = Plant::find($id);
        DB::beginTransaction();
        IQuery::delMosImg($plant->img);
        $plant_user = PlantUser::where('plant_id',$id);
        if ($plant_user->delete()) {
            if($plant->delete()) {
                DB::commit();
                return response()->json('true');
            } else {
                DB::rollBack();
                return response()->json('false');
            }
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
        $keyArr = $this->getKeyVal($request);
        $arr = ['intro', 'name', 'img'];
        $model->setRawAttributes($request->only($arr));
        DB::beginTransaction();
        if ($model->save()) {
            if ($id == -1) {
                $plant_user = new PlantUser;
                $plant_user->user_id = IQuery::getAuthUser($request->openid)->id;
                $plant_user->plant_id = $model->id;
                if ($plant_user->save()) {
                    if (count($keyArr[0])>0) {
                        foreach($keyArr[0] as $ka) {
                            $plant_tab = new PlantTab;
                            $plant_tab->key = $ka['key'];
                            $plant_tab->value = $ka['value'];
                            $plant_tab->plant_id = $model->id;
                            if (!$plant_tab->save()) {
                                DB::rollBack();
                                return response()->json('false');
                            }
                        }
                    }
                    DB::commit();
                    return response()->json('true');
                } else {
                    DB::rollBack();
                    return response()->json('false');
                }
            } else {
                if (count($keyArr[0])>0) {
                    foreach($keyArr[0] as $ka) {
                        if (isset($ka['id'])) {
                            $plant_tab = PlantTab::find($ka['id']);
                            $plant_tab->key = $ka['key'];
                            $plant_tab->value = $ka['value'];
                        } else {
                            $plant_tab = new PlantTab;
                            $plant_tab->key = $ka['key'];
                            $plant_tab->value = $ka['value'];
                            $plant_tab->plant_id = $id;
                        }
                        if (!$plant_tab->save()) {
                            DB::rollBack();
                            return response()->json('false');
                        }
                    }
                    $plt_ids = $this->getIdArr($id);
                    $dif = array_diff($plt_ids,$keyArr[1]);
                    return response()->json([
                        'plt_ids' => $plt_ids,
                        'res' => $keyArr[1],
                        'dif' => $dif,
                        'id' => $id
                    ]);
                    if(count($dif)) {
                        $plant_tab = PlantTab::where('plant_id', $id);
                        if(!$plant_tab::destroy($dif)) {
                            DB::rollBack();
                            return response()->json('false');
                        }
                    }
                }
                DB::commit();
                return response()->json('true');
            }
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
    
    /*
     * 获取key value
     */
    public function getKeyVal($request) {
        $arr = [];
        $arrId = [];
        for($i=0; $i<9999; $i++) {
            $key = 'key'.$i;
            $value = 'value'.$i;
            $hid = 'hid'.$i;
            if(isset($request->$key) && isset($request->$value)) {
                $arr[$i]['key'] = $request->$key;
                $arr[$i]['value'] = $request->$value;
                $arr[$i]['id'] = $request->$hid;
                if (isset($request->$hid)) {
                    $arrId[] = intval($request->$hid);
                }
            } else {
                break;
            }
        }
        return [$arr, $arrId];
    }
    
    /*
     * 根据id获取数组
     */
    public function getIdArr($id) {
        $arr = [];
        $plant_tabs = PlantTab::where('plant_id',$id)->select('id')->get();
        foreach($plant_tabs as $tab) {
            $arr[] = $tab->id;
        }
        return $arr;
    }
}