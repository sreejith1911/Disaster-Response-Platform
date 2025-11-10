import  {MongoClient} from 'mongodb';
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function connectDB(){
    try{
        await client.connect();
        console.log("db connected");
        return client.db('resqdb');
        }
    catch(err){
        console.log(err);
    }
}
export default connectDB;