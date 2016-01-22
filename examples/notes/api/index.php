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


$app->group('/noter', function () {
    $this->get('', function ($request, $response, $args) {
        echo json_encode(
            array_values(
                json_decode(
                    file_get_contents("noter.json"),
                    true
                )['data']
            )
        );
        return $response->withStatus(200);
    });

    $this->post('', function ($request, $response, $args) {
        if (isset($_POST['title'], $_POST['text'])) {
            $data = json_decode(file_get_contents("noter.json"), true);
            $data['id']++;
            $data['data'][$data['id']]=['id'=>$data['id'], 'title'=>utf8_encode($_POST['title']), 'text'=>utf8_encode($_POST['text'])];
            file_put_contents("noter.json", json_encode($data));
            return $response->write($data['id'])->withStatus(201);
        }else{
            return $response->withStatus(400);
        }
    });

    $this->put('/{id}', function ($request, $response, $args) {
        $data = json_decode(file_get_contents("noter.json"), true);
        if(isset($data['data'][$args['id']],$_POST['title'], $_POST['text'])){
            $data['data'][$args['id']]=['id'=>$args['id'], 'title'=>utf8_encode($_POST['title']), 'text'=>utf8_encode($_POST['text'])];
            file_put_contents("noter.json", json_encode($data));
            return $response->withStatus(200);
        }else{
            return $response->withStatus(400);
        }
    });

    $this->delete('/{id}', function ($request, $response, $args) {
        $data = json_decode(file_get_contents("noter.json"), true);
        if(isset($data['data'][$args['id']])){
            unset( $data['data'][$args['id']]);
            file_put_contents("noter.json", json_encode($data));
            return $response->withStatus(204);
        }else{
            return $response->withStatus(400);
        }
    });
});


$app->run();