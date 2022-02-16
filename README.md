# BookShelf

to make image scale to container max width and max height to 100%

Think about what will be reused and consider starting with partials / boilerplate design to prevent repeating code.

flex: 0 0 150px will hold an element at a fixed 150px height
flex: 1 1 auto will fill a sibling to the remaining height.  flex grow AND flex shrink turned on.

Added clubs model after making the books model and reviews model.  Didn't think through how I wanted the app to be structured so had to go back and redo a ton of work.  Had to restructure routes, object deleting middleware, change display logic to show things based on their club, etc.  Will spend more time planning next time.

To have a user join a club I had to make a new put route and console.log was necessary to troubleshoot through this.  Needed to get the username from the session in order to look up the user and the push the user into the clubMembers array.

wrote middleware to validate user input.