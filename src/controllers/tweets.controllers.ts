import { Response, Request } from 'express';
import { TweetRequestBody } from '~/models/requests/Tweet.requests';
import { ParamsDictionary } from 'express-serve-static-core';
import tweetsService from '~/services/tweets.services';
import { TWEETS_MESSAGES } from '~/constants/messages';
import { TokenPayload } from '~/models/requests/User.requests';

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const result = await tweetsService.createTweet(user_id, req.body);
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  });
};
