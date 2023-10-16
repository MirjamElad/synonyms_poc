
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

Indeed, the app could be in one of several status depending on where is the user in her journey. We have distinct states the app can be in. 
These are: **initial**, **searching**, **ready**, **edited**, **posting** or **error**.

### State management
