<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Input;

class AuthController extends Controller
{
    public function getLogin() {

        return \View::make('auth/login');
    }

    public function postLogin() {
        
        $input = Input::all();
        $validator = \Validator::make($input, array(
            'api_token' => 'required|string'
        ));

        if ($validator->fails()) {
            return \Redirect::to('login')->withInput()->withErrors($validator);
        }

        $user = User::getOrCreateFromTW($input['api_token']);
        if ($user) {
            \Auth::login($user);
            return \Redirect::to('/home');
        } else {
            Session::flash("error", "Failed Login");
            return \Redirect::to('login');
        }
    }

    public function getLogout() {

        \Auth::logout();
        return \Redirect::to('login');    
    }
}
