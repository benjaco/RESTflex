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



$app->group('/discussion', function(){
    include "../../requirements/sqli.php";
    $sqli = new sqli(array("127.0.0.1", "", "", "test"));

    $this->get('', function ($request, $response, $args) use ($sqli) {
        echo json_encode($sqli->pull_multiple("select * from diskotioner")->data);
    });
    $this->post('', function ($request, $response, $args) use ($sqli) {
        if (isset($_POST['title'])) {
            $insert = $sqli->push("insert into diskotioner (title) VALUES (?)", "s", $_POST['title']);
            if ($insert->affected_rows == 1) {
                return $response->withStatus(201)->write($insert->insert_id);
            }
            return $response->withStatus(400);
        }
        return $response->withStatus(400);
    });
    $this->delete('/{id:[0-9]+}', function ($request, $response, $args) use ($sqli) {
        $sqli->push("delete FROM  diskotion_kommentar where fk_kommentar = ?", "i", $args['id']);

        return $response->withStatus(
            ($sqli->push("delete FROM diskotioner WHERE id =?", "i", $args['id'])->affected_rows!==0?204:400)
        );
    });
    $this->group('/{id:[0-9]+}', function() use ($sqli){
        $this->get('', function ($request, $response, $args) use ($sqli) {
            echo json_encode($sqli->pull_multiple("select * from diskotion_kommentar WHERE fk_kommentar =?", "i", $args['id'])->data);
        });
        $this->post('', function ($request, $response, $args) use ($sqli) {
            if (isset($_POST['kommentar'])) {
                $insert = $sqli->push("insert into diskotion_kommentar ( fk_kommentar, kommentar) VALUES (?, ?)", "is", $args['id'], $_POST['kommentar']);

                if ($insert->affected_rows == 1) {
                    return $response->withStatus(201)->write($insert->insert_id);
                }
                return $response->withStatus(400);
            }
            return $response->withStatus(400);
        });
    });
});

$app->run();