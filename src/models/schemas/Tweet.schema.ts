import { ObjectId } from 'mongodb';
import { Media } from '../Other';
import { TweetAudience, TweetType } from '~/constants/enums';

interface TweetConstructor {
  _id?: ObjectId;
  user_id: ObjectId;
  type: TweetType;
  audience: TweetAudience;
  content: string;
  parent_id: null | ObjectId;
  hashtags: ObjectId[];
  mentions: ObjectId[];
  medias: Media[];
  guest_views: number;
  user_views: number;
  created_at?: Date;
  updated_at?: Date;
}

export default class Tweet {
  _id?: ObjectId;
  user_id: ObjectId;
  type: any;
  audience: any;
  content: string;
  parent_id: null | ObjectId;
  hashtags: ObjectId[];
  mentions: ObjectId[];
  medias: Media[];
  guest_views: number;
  user_views: number;
  created_at?: Date;
  updated_at?: Date;

  constructor({
    _id,
    user_id,
    type,
    audience,
    content,
    parent_id,
    hashtags,
    mentions,
    medias,
    guest_views,
    user_views,
    created_at,
    updated_at
  }: TweetConstructor) {
    this._id = _id;
    this.user_id = user_id;
    this.type = type;
    this.audience = audience;
    this.content = content;
    this.parent_id = parent_id;
    this.hashtags = hashtags;
    this.mentions = mentions;
    this.medias = medias;
    this.guest_views = guest_views;
    this.user_views = user_views;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }
}