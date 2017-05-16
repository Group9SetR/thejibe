<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompanyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('account_id')->unsigned()->nullable();
            $table->double('billable_hours_sum_weekly',16,2)->default(0);
            $table->double('non_billable_hours_sum_weekly',16,2)->default(0);
            $table->double('total_hours_sum_weekly',16,2)->default(0);
            $table->double('billable_hours_sum_monthly',16,2)->default(0);
            $table->double('non_billable_hours_sum_monthly',16,2)->default(0);
            $table->double('total_hours_sum_monthly',16,2)->default(0);
            $table->double('billable_hours_sum_yearly',16,2)->default(0);
            $table->double('non_billable_hours_sum_yearly',16,2)->default(0);
            $table->double('total_hours_sum_yearly',16,2)->default(0);
            $table->double('billable_hours_sum',16,2)->default(0);
            $table->double('non_billable_hours_sum',16,2)->default(0);
            $table->double('total_hours_sum',16,2)->default(0);
            $table->double('total_hours',16,2)->default(0);            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('company');
    }
}
