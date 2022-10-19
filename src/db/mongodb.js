import mongoose from 'mongoose';
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
const connectDB = async () =>
{
    const conn = await mongoose.connect("mongodb://localhost:27017/neo4j",connectionParams);
    console.log('MongoDB connected ');
}

export default connectDB;