<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Auth::routes();

Route::group(['middleware' => 'auth'], function () {
    Route::get('/dashboard', 'DashboardController@index');
});

Route::get('/home', 'HomeController@index');
Route::get('/profile', 'PagesController@profile');

Route::get('login', 'AuthController@getLogin');
Route::post('/login', 'AuthController@postLogin');
Route::get('/logout', 'AuthController@getLogout');

Route::get('/home', 'HomeController@index');
Route::get('/dash', 'DashboardController@index');