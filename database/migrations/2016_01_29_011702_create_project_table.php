<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('account_id')->unsigned()->nullable();
            $table->integer('company_id')->unsigned()->nullable();
            $table->integer('category_id')->unsigned()->nullable();
            $table->string('logo')->nullable();
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
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
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('project');
    }
}
