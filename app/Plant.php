<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plant extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];  //开启deleted_at
    protected $table='plants';  //绑定plants表
    
    public function users()
    {
        return $this->belongsToMany('App\User', 'plant_users', 'plant_id', 'user_id');
    }
}
