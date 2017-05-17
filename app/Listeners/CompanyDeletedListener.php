<?php

namespace App\Listeners;

use App\Events\CompanyDeleted;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class CompanyDeletedListener
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
     * @param  ProjectDeleted  $event
     * @return void
     */
    public function handle(CompanyDeleted $event)
    {
        foreach ($event->company->projects as $key => $project) {
            $project->delete();
        }
        $event->company->delete(); 
    }
}
