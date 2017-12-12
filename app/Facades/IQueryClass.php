<?php

/*
 * @version: 1.0 Iquery Facade
 * @author: limingcun
 * @date: 2017/12/12
 *
 */

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class IQueryClass extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'iquery';
    }
}