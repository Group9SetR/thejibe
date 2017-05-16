<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectAlertTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_alert', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('project_alert_type_id')->unsigned();            
            $table->integer('project_id')->ungisgned()->nullable();
            $table->double('amount',16,2);
            $table->string('amount_type',24);
            $table->string('hours_type',24);
            $table->boolean('notified')->default(false);
            $table->text('emails')->nullable();
            $table->integer('created_by')->unsigned();
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
        Schema::drop('project_alert');
    }
}
