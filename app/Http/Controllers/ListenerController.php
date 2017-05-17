<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ListenerController extends Controller
{
    public function postWebhook() {
    // Input structure
    //------------------------------
    // 'event' => 'PROJECT.UPDATED',
    // 'objectId' => '190727',
    // 'accountId' => '300586',
    // 'userId' => '166778', 
    //------------------------------
        $input = \Input::all();
        \Log::info($input);
        $explodedEvent = explode('.', $input['event']);
        $object = $explodedEvent[0];
        $event = $explodedEvent[1];
        switch ($object ) {
            case 'TIME':
                \Event::fire(new \App\Events\TimeEntryChanged($input));
                break;
            case 'PROJECT':
                switch ($event) {
                    case 'DELETED':
                        \Event::fire(new \App\Events\ProjectDeleted($input));
                        break;
                    case 'REOPENED':
                        \Event::fire(new \App\Events\ProjectRestored($input));
                        break;                    
                    default:
                        \Event::fire(new \App\Events\ProjectChanged($input));
                        break;
                }
                break; 

            default:
                # code...
                break;
        }
        return response('',200);
    }
}
