<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$api = app('Dingo\Api\Routing\Router');
// avant d'utiliser  le namespace je  plaçais App\Http\Controllers\V1\ avant chaque controller dans les 2 resource  ainsi que  dans post et get
// $api->version('v1',[
//               'namespace' => 'App\Http\Controllers\V1',
//               'expires' => 5,
//               'limit' => 100,
//               'middleware' => 'api.throttle',
//               'prefix' => 'api/v1'],
//               function ($api) {

//             $api->resource('posts', "PostController",);
//             $api->resource('comments', "CommentController", [
//             'except' => ['store', 'index']
//             ]);
//             $api->post('posts/{id}/comments','CommentController@store');
//             $api->get('posts/{id}/comments','CommentController@index');
//     });

$api->version(
    'v1',
    [
        'middleware' => ['api.throttle'],
        'limit' => 1500,
        'expires' => 5,
        'prefix' => 'api/v1',
        'namespace' => 'App\Http\Controllers\V1'
    ],
    function ($api) {
        $api->group(['middleware' => 'api.auth'], function ($api) {
            //Posts protected routes
            $api->resource('posts', "PostController", [
                'except' => ['show', 'index']
            ]);
            //Comments protected routes
            $api->resource('comments', "CommentController", [
                'except' => ['show', 'index']
            ]);
            $api->post('posts/{id}/comments', 'CommentController@store');
            $api->post('createreadinglist', 'ReadingController@store');
            // Get the authenticated User
            $api->get(
                '/auth/login',
                [
                    'uses' => 'AuthController@getUser',
                    'as' => 'api.Auth.getUser'
                ]
            );
            // Logout user by removing token
            $api->delete(
                '/auth/delete',
                [
                    'uses' => 'AuthController@deleteInvalidate',
                    'as' => 'api.Auth.invalidate'
                ]
            );
            $api->delete(
                'userlist/{post}',
                [
                    'uses' => 'ReadingController@destroy',
                    'as' => 'api.ReadingPost.destroy'
                ]
            );
            // Refresh token
            $api->patch(
                '/auth/refresh',
                [
                    'uses' => 'AuthController@patchRefresh',
                    'as' => 'api.Auth.refresh'
                ]
            );
              // Refresh token
            $api->patch(
                '/userlist/{post}',
                [
                    'uses' => 'ReadingController@update',
                    'as' => 'api.ReadingPost.update'
                ]
            );
            // si ça ne marche pas  ba je les remet a leur place  
            $api->get('posts', 'PostController@index');
            $api->get('posts/{post}', 'PostController@show');
            $api->get('finishedlist','ReadingController@secondIndex');
            $api->get('readinglist','ReadingController@thirdIndex');

            $api->get('posts/{id}/comments', 'CommentController@index');
            $api->get('comments/{comment}', 'CommentController@show');
            $api->get('userlist', 'ReadingController@index');
        });
        // get all posts for match-sorter API
        $api->get('matchsorter/posts', 'PostController@getAllDbPosts');
        //registration
        $api->post(
            '/auth/register',
            [
                'uses' => 'RegisterController@store',
                'as' => 'api.Auth.registration'
            ]
        );
        // Get the token
        $api->post(
            '/auth/login',
            [
                'as' => 'api.Auth.login',
                'uses' => 'AuthController@postLogin',
            ]
        );
    }
);
//$router->post('/login', 'AuthController@postLogin');
// $router->post(
//     '/auth/login', [
//     'as' => 'api.auth.login',
//     'uses' => 'AuthController@postLogin',
//     ]
//     );
// $router->delete(
//     '/', [
//     'uses' => 'AuthController@deleteInvalidate',
//     'as' => 'api.auth.invalidate'
//     ]
// );
// $router->patch(
//     '/', [
//     'uses' => 'AuthController@patchRefresh',
//     'as' => 'api.auth.refresh'
//     ]
//     );
$router->get('/', function () use ($router) {
    return $router->app->version();
});
// function resource($uri, $controller,$router,$except= [])
// {
//     //$verbs = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'];

//     if(!in_array('index',$except)){
//         $router->get($uri, $controller.'@index'); // ligne skipped by CommentController
//     }
//     if(!in_array('store',$except)){
//         $router->post($uri, $controller.'@store');// ligne skipped by CommentController
//     }
//     if(!in_array('show',$except)){
//         $router->get($uri.'/{id}', $controller.'@show');
//     }
//     if(!in_array('update',$except)){
//         $router->patch($uri.'/{id}', $controller.'@update');
//         $router->put($uri.'/{id}', $controller.'@update');
//     }
//     if(!in_array('destroy',$except)){
//         $router->delete($uri.'/{id}', $controller.'@destroy');
//     }
// }
// $router->get('/', function () use ($router) {
//     return $router->app->version();
// });
// // $router->get('/api/posts/', [
// //     'uses' => 'PostController@index',
// //     'as' => 'list_posts'
// // ]);
// resource('api/posts', 'PostController',$router);
// resource('api/comments', 'CommentController',$router,['index','store']);
// $router->get('api/posts/{id}/comments','CommentController@index');
// $router->post('api/posts/{id}/comments','CommentController@store');
