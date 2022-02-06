import Express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import { matchSorter } from "match-sorter";
const app = Express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 4555;
let data;
const maQuery = {};

axios
  .get("http://localhost:8000/api/v1/matchsorter/posts")
  .then((res) => {
    return (data = res.data);
  })
  .catch((err) => console.log(err));

app.post("/filtredlist", (req, res) => {
  maQuery.query = JSON.parse(JSON.stringify(req.body)).query;
  console.log(maQuery);

  res.sendStatus(200);
});
//  function  paginate(model){
//  // return (req,res,next)=>{
//     // const page = parseInt(req.query.page);
//     // const limit = parseInt(req.query.limit);
//     const startIndex = (page -1) * limit ;
//     const endIndex = page * limit;
//     const result = {};
//     if(endIndex < model.length){
//       result.next = {
//         page:page+1,
//         limit:limit ,
//       };
//     };
//     if(startIndex > 0){
//       result.previous ={
//         page:page-1 ,
//         limit: limit
//       };
//     };
//     result.results = model.slice(0,3);
//     return  result
//     // res.paginatedResult =result;
//     // next();

//   //}
// }
app.get("/filtredlist", (req, res) => {
  new Promise((resolve, reject) => {
    if (maQuery.query?.includes("FAIL")) {
      reject({ message: "Key Word not Allowed" });
    }
    async function query(search) {
      return matchSorter(data.data, search, {
        keys: ["title"],
      });
    }
    resolve(query(maQuery.query));
  })
    .then((result) => {
      // console.log(result)
      res.status(200).send(result);
      console.log(result);
      maQuery.query?.length > 0 || maQuery.query === ""
        ? delete maQuery.query
        : void 0;
    })
    .catch((err) => {
      //console.log(err);
      res.status(500).send(err);
      maQuery.query?.length > 0 || maQuery.query === ""
        ? delete maQuery.query
        : void 0;
    });
});

app.listen(port, () => console.log("listening on port " + port));
