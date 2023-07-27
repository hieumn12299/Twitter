import { config } from 'dotenv';
import { TweetRequestBody } from '~/models/requests/Tweet.requests';
import databaseService from './database.services';
import Tweet from '~/models/schemas/Tweet.schema';
import { ObjectId, WithId } from 'mongodb';
import HashTag from '~/models/schemas/Hashtag.schema';
config();

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) =>
        //Tìm hashtag trong DB nếu có thì lấy, không thì tạo mới
        databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new HashTag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      )
    );
    return hashtagDocument.map((hashtag) => (hashtag.value as WithId<HashTag>)._id);
  }

  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags);
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    );
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId });
    return tweet;
  }
}

const tweetsService = new TweetsService();

export default tweetsService;
