
# Fictitious synonyms editor app 
This repo contains a small fictitious web app for testing purposes.
The mini app allow users to enter a word and look up its synonyms. It should also be possible to add (and remove) new synonyms to the given word!

If the word A is a synonym of the word B, and B is a synonym of the word C then both A and C are necessarily synonyms as well! There is no notion of context or weight of how close (synonymous) are two words. If any number of words are synonyms they are equivalent (completely synonymous) to each other!
Thus, if any words are synonymous then they belong to exact same group of synonyms. Similarily, any word can only belong to a single group of synonyms. 

Note that the web app has both a back end and a front end with no on-disk persistence as synonyms are held memory!

## Getting Started
Before reading the code, it is advised to first to play with the web app and get a sense of what it's doing!

You can either directly access both code and play with the app [here: synonyms_poc](https://stackblitz.com/github/MirjamElad/synonyms_poc?file=src%2Fapp%2Fpage.tsx) with your browser 

Alternatively, you can pull from [github](https://github.com/MirjamElad/synonyms_poc) and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser 

## Teck stack
The app is built with NextJS (13.5.4). To manage state on the front end, the **adax** & **adax-react** libraries are used (more on these below). For styling and animation **tailwind** & **tailwindcss-animated** have been used respectively.

## Code structure

### Backend

The code managing the synonyms is located under *app/lib/**synonymManager*** where the exported **synonymManager** singleton is responsible for managing the synonyms by allowing safely adding, removing and retrieving synonyms as per the requirements discussed above.

The **synonymManager** is used through a REST interface with a **GET** & **POST** "entry points" are defined under *app/api/synonyms/[wordList]/**route.ts*** and *app/api/synonyms/**route.ts*** respectively.

### Frontend
#### Calling the backend
To access and make use of the aforementioned "entry points" from the front end. We have a couple of helper functions conviniently named **GET** & **POST** and available at *app/lib/**appClient***.

These two functions provide a succinct way to call the REST endpoints where their signature define the input to the REST end point and two callback functions **onSuccess** & **onFailure**.

### Views structure
The app presents its self as follows. First you have an input where the user enters the word to get or set synonyms for (look at *app/components/**SearchBox***). After the user enters a valid word and hits enter/go. The word appears below with all its synonyms (if it has already synonyms in the system). The user may enter new synonyms or delete old ones and save her work  (look at *app/components/SynonymEditor/**SynonymCmp***). 

There are a number of other components under *app/components/**SynonymEditor**/* that make up the **SynonymEditor** spoken about above. Users can view the listed synonyms that were retrieved from the server (backend) or that they added them selves. Users can also delete any synonyms. If they delete a synonym coming from the server they also have the ability to undelete it (or re-create any synonym by re-typing it ..etc). If the user made any changes to a word synonyms, they may either save those changes or discard them!

There also other components under **app/components/** to show a spinner while the app is reaching out to the server and a guide to provide some context/insight/guidance to the user on how to proceed. 

Indeed, the app could be in one of several status depending on where is the user in her journey. We have distinct statuses the app can be in. 
These are: **initial**, **searching**, **ready**, **edited**, **posting** or **error**.

The app starts in the **initial** status, when the user picks a word to manage synonyms for the app moves to **searching** while it is bringing any saved anonymous for that word. When searching is done, the app moves to the **ready** status where the user is able to view but also edit synonyms (Here the user can also chose to start managing some other word's synonyms by re-using the search box).
If the user does any changes (adding and/or removing) to the word's synonyms, she is able to save those changes to the server or alternatively discard/cancel her changes. If she decides to save her changes the app moves to the **posting** status and moves back to the **ready** status when the posting to the server is done. In case she decides to discard her changes, all these changes are discarded and the app directly moves to the **ready** status.
In case of an unexpected error, the app moves to the **error** status and back to the appropriate status according to the general state of our application.

Note that all these views have generic react code except of the usage of two functions. Namely, **trigger** from **adax** and **useSunc** from **adax-react**. Actually, **useSunc** is only used in the main page.tsx but it is usually used in multiple views. We use **trigger** to wrap any function that manipulates the app's state and **useSunc** can be used by any view component to subscribe to a query of the state. This makes the view re-render whenever the result of that query changes. More on this later. 

### State management
After playing with this mini app and reading the above explanations. Let's move how we manage the state and logic of our app. For that we need to inspect the code under **app/client-state/**.
Here we have **data.ts** that holds the full state of our app so that it is enough to describe the state of our app at any point in the progress of its usage. In addition to the status described above, it holds the word we are managing synonyms for, its synonyms saved on the server, any temporarily added or removed synonyms (temporarily as in not saved on the server yet and are thus discardable on the client side) as well as some helper functions to "*declaratively*" managing the **status**!

To access and manipulate the app state in **data.ts** one has to go through "*its*" **facade.ts**.
In there you have the functions needed to mutate the **app state** and thus operate our mini web app. Those functions accept some input object with which to update the state and also have a reference to the state (or data) that is to be mutated.
Here we have all the functions needed to move our app from status to status and update the app's state/data accordingly.

The code under **client-state** is generic JavaScript (or TypeScript in this case) and does not contain any react or DOM specific code. We could have called the folder **vanilla** instead of **client-state**.
As said earlier, this code is all we need to manipulate the state of the app. We only need to wire the lifecycle of our (react in this example) views with the app's state. 
The facade has both mutator and query functions with which to manipulate and respectively query the state (or data) on changes. But how do we cause the query functions to run when the underlying data undergoes "relevant" changes. Here comes **addRule** imported from **adax**, it specifies what query might need to run on what mutation. 

Mutators and queries are used on the views where mutators are wrapped with **trigger** and queries with **useSunc** to ensure relevant views re-render when needed.

We are also using **trigger** within the facade as it is needed in the callbacks after calling the server. Naturally, we do need to update the app's state with what the server returns. Thus, we need to use  **trigger** to cause any subscribing view to rerender when necessary.

Note here the only non-generic JavaScript/TypeScript code is in the form of two functions: **trigger** & **addRule** both imported from **adax**. 


