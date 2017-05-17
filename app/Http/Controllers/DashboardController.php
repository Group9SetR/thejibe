<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
            $auth = array (
                'id'            => Auth::User()->id,
                'first_name'    => Auth::User()->first_name,
                'last_name'     => Auth::User()->last_name,
                'api_token'     => Auth::User()->api_token,
                'user_name'     => Auth::User()->username);
        return view('dashboard', compact('auth'));
    }
}
