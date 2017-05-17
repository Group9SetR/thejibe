<?php

namespace App\Listeners;

use App\Events\CompanyChanged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class CompanyChangedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ProjectChanged  $event
     * @return void
     */
    public function handle(CompanyChanged $event)
    {
        \App\Models\Company::updateOrCreateFromTWId($event->company_id, $event->user); 
    }
}
