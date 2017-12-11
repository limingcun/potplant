<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];  //开启deleted_at
    protected $table='plants';  //绑定plants表
}
