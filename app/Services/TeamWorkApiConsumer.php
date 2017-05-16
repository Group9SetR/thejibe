<?php namespace App\Services;
    
use Illuminate\Support\ServiceProvider;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Config;
use DateTime;


/**
 * TeamWorkApiConsumer class.
 * 
 * 
 */
class TeamWorkApiConsumer {

    private $api_token;
    private $client;
    
     
    public function __construct($api_token, $subdomain = null) {
        $this->api_token    = $api_token;
        $this->base_uri     = 'https://' . $subdomain . '.teamwork.com';
        $this->client       = new Client();
    }

    private function getHeaders() {
        $credentials = str_replace("`", "", $this->api_token . ":xxx");
        $key = "Basic " . base64_encode($credentials);
        return ['Content-type' => 'application/json',
        'Authorization' => $key];
    }

    private function getAuth() {
        return [$this->api_token . ":xxx", 'X'];
    }

    private function httpGet($uri) {
        try {
            $response = $this->client->get($this->base_uri . $uri, [
                //'Authorization' => 'Basic '.$credentials,
                'headers'      => $this->getHeaders(),
            ]); 
        } 
        catch(ClientException $e) {
            return false;
        }
        return json_decode($response->getBody(), true); 
    }    

    private function httpDelete($uri) {
        try {
            $response = $this->client->delete($this->base_uri . $uri, [
                'auth'         => $this->getAuth(),
                'headers'      => $this->getHeaders(),
            ]); 
        } 
        catch(ClientException $e) {
            return false;
        }
        return json_decode($response->getBody(), true); 
    } 

    private function httpPost($uri, $data = null) {
        try {
            $response = $this->client->post($this->base_uri . $uri, [
                'auth'         => $this->getAuth(),
                'headers'      => $this->getHeaders(),
                'body'         => json_encode($data),
            ]); 
        } 
        catch(ClientException $e) {
            return false;
        }
        return json_decode($response->getBody(), true); 
    }  

    private function httpPut($uri, $data = null) {
        try {
            $response = $this->client->put($this->base_uri . $uri, [
                'auth'         => $this->getAuth(),
                'headers'      => $this->getHeaders(),
                'body'         => json_encode($data),
            ]); 
        } 
        catch(ClientException $e) {
            return false;
        }
        return json_decode($response->getBody(), true); 
    }

    public function authenticate() {
        try {
            $response = $this->client->get('http://authenticate.teamworkpm.net/authenticate.json', [
                //'auth'         => $this->getAuth(),
                'headers'      => $this->getHeaders(),
            ]); 
        } 
        catch(ClientException $e) {
            return false;
        }
        return json_decode($response->getBody(), true);     
    }

    public function getMe() {
        return $this->httpGet('/me.json');      
    }

    public function getCompany($company_id) {
        return $this->httpGet('/companies/' . $company_id . '.json');            
    }

    public function getCompanies() {
        return $this->httpGet('/companies.json');          
    }

    public function getProject($project_id) {
        return $this->httpGet('/projects/' . $project_id . '.json');                   
    }

    public function getProjects() {
        return $this->httpGet('/projects.json');                   
    }

    public function getProjectCompanies($project_id) {
        return $this->httpGet('/projects/' . $project_id . '/companies.json');                 
    }

    public function getProjectRates($project_id) {
        return $this->httpGet('/projects/' . $project_id . '/rates.json');
    }

    public function getProjectCategory($category_id) {
        return $this->httpGet('/projectCategories/' . $category_id . '.json');  
    }

    public function getProjectCategories() {
        $categories = $this->httpGet('/projectCategories.json');
        $return = [];
        foreach ($categories['categories'] as $key => $category) {
            $return[$category['id']] = $category;
        }
        return $return;              
    }

    public function getProjectTimeTotals($project_id, array $params) {
        $httpParams = http_build_query($params);
        return $this->httpGet('/projects/' . $project_id . '/time/total.json?' . $httpParams);                 
    } 
    
    public function getTimeEntry($time_entry_id) {
        return $this->httpGet('/time_entries/' . $time_entry_id . '.json');                 
    }

    public function getWebhooks() {
        return $this->httpGet('/webhooks.json');                 
    }

    public function postWebhook($data) {
        return $this->httpPost('/webhooks.json', $data);                 
    }

    public function putWebhook($data) {
        return $this->httpPut('/webhooks/'. $data['webhook']['id'] .'.json', $data);                 
    }

    public function enableWebhooks() {
        return $this->httpPut('/webhooks/enable.json');                 
    } 

    public function deleteWebhook($data) {
        return $this->httpDelete('/webhooks/'. $data['webhook']['id'] .'.json', $data);                 
    }   
}   //  class TeamWorkApiConsumer
