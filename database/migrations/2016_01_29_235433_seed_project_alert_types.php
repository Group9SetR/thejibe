<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SeedProjectAlertTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \App\Models\ProjectAlertType::create(['name' => 'Single', 'description' => '']);
        \App\Models\ProjectAlertType::create(['name' => 'Weekly', 'description' => '']);
        \App\Models\ProjectAlertType::create(['name' => 'Monthly', 'description' => '']);
        \App\Models\ProjectAlertType::create(['name' => 'Yearly', 'description' => '']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::table('project_alert_type')->truncate();
    }
}
