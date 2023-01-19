require('dotenv').config();
const { IgApiClient } = require('instagram-private-api');

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  console.log(JSON.stringify(auth));

  const following = await ig.feed.accountFollowing().items();
  let followingIds = following.map(following => following.pk);

  while (followingIds.length > 0) {
    const batchIds = followingIds.splice(0, 10);
    const reelsFeed = ig.feed.reelsMedia({
        userIds: batchIds,
    });
    const storyItems = await reelsFeed.items();
    if (storyItems.length === 0) {
        console.log("No stories to watch");
        return;
    }
    const seenResult = await ig.story.seen(storyItems);
    console.log(seenResult.status);
    storyItems.forEach(async storyItem => {
        const user = await ig.user.info(storyItem.user.pk);
        console.log("Story seen from : @"+user.username)
    });
  }
})();
