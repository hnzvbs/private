const { IgApiClient } = require('instagram-private-api');
require('dotenv').config();

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  console.log(JSON.stringify(auth));

  const followers = await ig.feed.accountFollowers().items();
  let followerIds = followers.map(follower => follower.pk);

  while (followerIds.length > 0) {
    const batchIds = followerIds.splice(0, 10);
    const reelsFeed = ig.feed.reelsMedia({
        userIds: batchIds,
    });
    const storyItems = await reelsFeed.items();
    if (storyItems.length === 0) {
        console.log("No stories to watch");
        return;
    }
    storyItems.forEach(async storyItem => {
        const user = await ig.user.info(storyItem.user.pk);
        const seenResult = await ig.story.seen([storyItem]);
        console.log("Story seen from : @"+ user.username);
    });
  }
})();
