<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        JavaScript::put([
            'auth_id' => Auth::User()->id,
            'auth_firstname' => Auth::User()->first_name,
            'auth_lastname' => Auth::User()->last_name,
            'auth_apitoken' => Auth::User()->api_token,
            'auth_username' => Auth::User()->user_name,
        ]);
        return view('dashboard');
    }
}
