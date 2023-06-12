import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.97pzbjo.mongodb.net/?retryWrites=true&w=majority`;

class DatabaseService {
  private client: MongoClient;

  constructor() {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect();
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }
}

// create Object from class DatabaseService
const databaseService = new DatabaseService();
export default databaseService;
