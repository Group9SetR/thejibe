<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCompanyIdForeignKeyToProjectAlertTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('project_alert', function (Blueprint $table) {
            // $table->foreign('project_id')->references('id')->on('project')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            // $table->foreign('company_id')->references('id')->on('company')->onUpdate('RESTRICT')->onDelete('RESTRICT');
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
            $table->dropForeign('project_alert_project_project_id_foreign');
            $table->dropForeign('project_alert_company_company_id_foreign');
        });
    }
}
