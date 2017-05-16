<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToProjectAlertTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_alert', function (Blueprint $table) {
            $table->foreign('project_alert_type_id')->references('id')->on('project_alert_type')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('created_by')->references('id')->on('user')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('project_alert', function (Blueprint $table) {
            $table->dropForeign('project_alert_project_alert_type_project_alert_type_id_foreign');
            $table->dropForeign('project_alert_user_created_by_foreign');
        });
    }
}
