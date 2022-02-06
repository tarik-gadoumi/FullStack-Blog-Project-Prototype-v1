<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Transformers\PostTransformer;
use App\Models\Post;
use Dingo\Api\Routing\Helpers;



class PostController extends Controller
{
    use Helpers;
    public function __construct(Post $post, PostTransformer  $postTransformer)
    {
        $this->post = $post;
        $this->transformer = $postTransformer;
    }

    public  function getAllDbPosts()
    {
        $allposts = $this->post->all();
        return $this->response->collection($allposts, $this->transformer);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $posts = $this->post->paginate(5)->toArray();

        $posts = $this->post->paginate(5);
        // return [
        //'data' => $posts['data'], //or $posts->items() ou item() je ne sais plus x)
        //  'total_count' => $posts->count(),
        //  'limit (per_Page)' => $posts->perPage(),
        //  'pagination' => [
        //  'next_page' => $posts->nextPageUrl(),
        //  'current_page' => $posts->url($posts->currentPage()),
        //  'prev_page' => $posts->previousPageUrl(),
        //  ],
        //  'First Page'=>$posts->url(1),
        //  'Last Page' => $posts->url($posts->lastPage())
        //];    
        //  return $posts->links() ;
        return $this->response->paginator($posts, $this->transformer);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $input['user_id'] = $this->user->id;
        $validationRules = [
            'title' => 'required|min:1',
            'author' => 'required|min:1',
            'coverImageUrl' => 'required|min:1',
            'content' => 'required|min:1',
            'status' => 'required|in:draft,published',
            'user_id' => 'required|exists:users,id'
        ];
        $validator = \Validator::make($input, $validationRules);
        if ($validator->fails()) {
            return new \Illuminate\Http\JsonResponse(
                [
                    'errors' => $validator->errors()
                ],
                \Illuminate\Http\Response::HTTP_BAD_REQUEST
            );
        }
        $Thepost = $this->post->create($input);
        // return [
        // 'data' => $input
        // ];
        return $this->response->item($Thepost, $this->transformer);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($post)
    {
        //$comment = $this->api->get("api/v1/posts/{$post}/comments"); <== ceci est  réaliser grâce au Helper provenant de Dingo

        $Thepost = $this->post->find($post);
        if (!$Thepost) {
            abort(404);
        }
        // return $Thepost;
        return $this->response->item($Thepost, $this->transformer);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $post)
    {
        // $input = $request->all();
        // $this->post->where('id', $id)->update($input);  
        // return $this->post->find($id);
        //$this->api->post("api/v1/posts/{$post}/comments",['comment'=>"ceci provequera une mutation de tout les commentaire du post 1 ?"]);

        $input = $request->all();
        $Thepost = $this->post->find($post);
        if (!$Thepost) {
            abort(404);
        }

        if ($this->user->id != $Thepost->user_id) {
            return new JsonResponse(
                [
                    'errors' => 'Only Post Owner can update it'
                ],
                Response::HTTP_FORBIDDEN
            );
        }
        $Thepost->fill($input);
        $Thepost->save();
        // return $Thepost;
        return $this->response->item($Thepost, $this->transformer);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($post)
    {
        // $post = $this->post->destroy($id);
        // return ['message' => 'deleted successfully', 'post_id' => $post];
        $Thepost = $this->post->find($post);
        if (!$Thepost) {
            abort(404);
        }
        if ($this->user->id != $Thepost->user_id) {
            return new JsonResponse(
                [
                    'errors' => 'Only Post Owner can delete it'
                ],
                Response::HTTP_FORBIDDEN
            );
        }
        $Thepost->delete();
        return ['message' => 'deleted successfully', 'post_id' => $post];
    }
}
