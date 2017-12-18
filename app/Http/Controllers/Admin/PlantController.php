<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Plant;
use IQuery;

class PlantController extends Controller
{
    public function index(Request $request) {
        $openid = IQuery::cleanInput($request->openid);
        $plant = Plant::join('users','plant_id','=','user_id')->where('users.openid',$openid)->get();
        return response()->json($plant);
    }
}