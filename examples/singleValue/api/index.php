<?php
/**
 * Created by PhpStorm.
 * User: Benjaco
 * Date: 12-01-2016
 * Time: 16:36
 */


require "../../vendor/autoload.php";

$c = new \Slim\Container(); //Create Your container

//Override the default Not Found Handler
$c['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'text/json')
            ->write('{"status":404}');
    };
};



$app = new \Slim\App($c);

$app->group('/variabel', function(){
    $this->get('', function ($request, $response, $args) {
        echo file_get_contents("variable.txt");
    });
    $this->put('', function ($request, $response, $args) {
        echo file_put_contents("variable.txt", $_POST['data']);
    });
});
$app->run();