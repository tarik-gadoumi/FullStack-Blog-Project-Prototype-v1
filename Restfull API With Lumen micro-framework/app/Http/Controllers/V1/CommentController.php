<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Transformers\CommentTransformer;

class CommentController extends Controller
{   use Helpers ;
    public function __construct(\App\Models\Comment $comment ,CommentTransformer $commentTransformer )
    {
                $this->comment = $comment;
                $this->transformer =$commentTransformer ;
               
                

    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        //$post = $this->post->find($id);
        $records = $this->comment->where('post_id','=',$id)->paginate(20);

        // $response = [
        //     'data' => $records->items(),
        //       'total_count' => $records->count(),
        //      'limit (per_Page)' => $records->perPage(),
        //      'pagination' => [
        //         'next_page' =>  $records->nextPageUrl(),
        //         'current_page' => $records->url($records->currentPage()),
        //         'prev_page' => $records->previousPageUrl(),
        //      ],
        //      'First Page'=>$records->url(1),
        //      'Last Page' => $records->url($records->lastPage())
        // ];

        // return $response;
        return $this->response->paginator($records, $this->transformer);

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
    public function store(Request $request , $id)
    {       
        $input = $request->all();
        //echo($request);
        $input['user_id'] = $this->user->id; // ceci est  un  type  = Number
        $input['post_id'] = (int)$id; // je deverais peut etre aller implementer une method dans le helper qui fait que je puisse $this->post->id
       $validationRules = [
        'comment' => 'required|min:1',
        'post_id'=>'required|exists:posts,id', //it is required but  set by the Api  look the code above  $input['post_id']=...
        'user_id' => 'required|exists:users,id' //it is required but  set by the Api look the code above   $input['user_id']= ...
        ];
        $validator = \Validator::make($input, $validationRules);
        if ($validator->fails()) {
        return new \Illuminate\Http\JsonResponse(
        [
        'errors' => $validator->errors()
        ], \Illuminate\Http\Response::HTTP_BAD_REQUEST
        );
        }
        $commentCreated= $this->comment->create($input);
        return $this->response->item($commentCreated, $this->transformer);


        //  return [
        //     'data' => $input
        //  ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($comment)
    {
        //$comments = $this->api->get("api/posts/$comment/comments");
        $Thecomment =$this->comment->find($comment);
        return $this->response->item($Thecomment, $this->transformer);


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
    public function update(Request $request, $comment)
    {
        $input = $request->all();
        $Thecomment= $this->comment->find($comment);
        if(!$Thecomment) {
            abort(404);
            }
        if($this->user->id != $Thecomment->user_id){
            return new JsonResponse(
                [
                'errors' => 'Only Post Owner can update it'
                ], Response::HTTP_FORBIDDEN
                );
            }    
        $Thecomment->fill($input);
        $Thecomment->save();
        // return $Thecomment;
        return $this->response->item($Thecomment, $this->transformer);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($comment)
    {
        $Thecomment = $this->comment->find($comment);
        if(!$Thecomment) {
            abort(404);
        }
        if($this->user->id != $Thecomment->user_id){
            return new JsonResponse(
            [
            'errors' => 'Only Post Owner can delete it'
            ], Response::HTTP_FORBIDDEN
            );
            }
        $Thecomment->delete();
        return ['message' => 'deleted successfully', 'comment_id' => $comment];
    }
}



