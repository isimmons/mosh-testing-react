# Testing React Apps

This project may or may not be modified from Mosh's original code. It is for me to share easily between home and work PC's The original starter project is at https://github.com/mosh-hamedani/react-testing-starter Be sure to use that if you are taking the course.

You can find the course at
https://codewithmosh.com

Personal course notes at the end of this file

## About this Project

This is a React app built with the following technologies and libraries:

- Auth0
- Tailwind
- RadixUI
- React Router
- React Query
- Redux Toolkit

Please follow these instructions carefully to setup this project on your machine.

## Setting up Auth0 for Authentication

1. **Sign up for an Auth0 Account:**

   If you don't already have an Auth0 account, you can sign up for one at [https://auth0.com/](https://auth0.com/). Auth0 offers a free tier that you can use for your project.

2. **Create a New Application:**

   - Log in to your Auth0 account.
   - Go to the Auth0 Dashboard.
   - Click on "Applications" in the left sidebar.
   - Click the "Create Application" button.
   - Give your application a name (e.g., "My React App").
   - Select "Single Page Web Applications" as the application type.

3. **Configure Application Settings:**

   - On the application settings page, configure the following settings:
     - Allowed Callback URLs: `http://localhost:5173`
     - Allowed Logout URLs: `http://localhost:5173`
     - Allowed Web Origins: `http://localhost:5173`
   - Save the changes.

4. **Obtain Auth0 Domain and ClientID:**

   - On the application settings page, you will find your Auth0 Domain and Client ID near the top of the page.
   - Copy the Auth0 Domain (e.g., `your-auth0-domain.auth0.com`) and Client ID (e.g., `your-client-id`).

5. **Create a `.env.local` File:**

   - In the root directory of the project, you'll find a sample `.env` file. Make a copy and save it as `.env.local`.
   - Replace the Auth0 Domain and Client ID with the actual values you obtained from Auth0.

## Running the App

Now that you have set up Auth0 and configured your environment variables, you can run the React app using the following commands:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

This will start the back-end process at `http://localhost:3000`. If port 3000 is in use on your machine, update the port number in the following files and run `npm start` again:

- json-server.json
- src/main.tsx

# Personal Course Notes

## What to test

### components

How it renders under various conditions

- verify correct usage of props good/bad/missing
  How it responds to user interactions
- inputs (simulated)

No test is better than a bad test
Test behavior, not implementation

Remember the testing pyramid introduced in js testing and how it is a guide but can be modified
for a specific use case. When testing react apps we can lean towards more integration testing, followed by unit testing in the middle, and E2E as the least.

The integrations tests are slower but give us better confidense that our application as a whole works
as it is supposed to. They are less likely to break on refactor as long as the end result stays the same. If something does break then it might mean a separate unit test is needed but not nessesarily.
It may mean we have a bad test and just need to refactor the test to account for changes in input.

Don't test styles. They don't garantee the application works. Style is purley asthetic. You can test that the user (simulated with test runner) sees an H1 element but don't test what font or style it is. I think storybook or something similar should be used for this. And on that note, I really don't like the storybook way of testing that mixes these. I think a totally separate storybook should be used for this purpose. Although the component must render properly to be able to test the style is correct.

#### render testing

Make sure it renders correctly. Side note, I am changing inline prop types to external defined so props can be easily changed at the top of the component file. (i.e. GreetProps = { name: string }) See components/Greet.tsx. This is a preference of mine. Not sure the type should be exported like some developers do unless it is actually needed in another file.

Greet test: I think it is an important distiction to make here. We don't make the name prop optional because <Greet name=""> is ugly. We can do <Greet /> and get a squiggly from Typescript but the testing framework will still render the component properly and pass the second test. This is because the missing prop is a Typescript issue and not a testing issue. The conditional will return falsy for the empty string which in this case is the same as returning false.But Typescript is telling us that there are two ways in which to call the Greet component. One with and one without the name prop. This is what optional types are for.

#### type checking tests ?

See the first test in Greet.test.tsx. Not sure this is nessessary ??? The other 2 tests will tell us
if the type is required but not if the type is optional so maybe it's a good addition? Need to do more testing and looking into. It is kinda nice to

#### simplifying tests

I like to put a vitest-env.d.ts file inside my tests directory to reference vitest/globals types. This way I don't need to add the types option to compiler options in tsconfig so test related things are kept separate from the project. Not sure it there will be issues later but if so I'll change it.

Also, put import for the jest matchers in the setup file so they will be auto imported before every test. We don't do this with render, screen from testing-library/react because there are actual use cases for overwriting these methods in which case we would want to be able to import the ones from testing-library or our overwritten version from different locations for different types of tests.
https://testing-library.com/docs/react-testing-library/setup/

There is an extension though to make typing the import line easy. It's the testing-library snippets extension by dein software

### test UserAccount

#### queryByRole vs getByRole

getByRole will throw an error so if you want to make sure something is not in the document use queryByRole and then not.toBeInTheDocument

#### findByText

findByText returns a promise so you have to await it. But this function can be used to find text in the document. In the case of the UserAccount test we can't use getByRole because div and strong by default don't have a role. If we want to be specific we can use testing id's (more later) or

## Side Note on why getByRole vs getById

Lots of things to think about here. https://github.com/testing-library/react-testing-library/issues/683

https://testing-library.com/docs/queries/about/#priority
https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

### Testing the ProductImageGallery

There are two forms of loop that can be used here

```js
for (const [index] of images.entries()) {
  expect(images[index]).toHaveAttribute("src", imageUrls[index]);
}

// this second one is slightly cleaner so I went with it in the test
imageUrls.forEach((url, index) => {
  expect(images[index]).toHaveAttribute("src", url);
});
```

### testing user interactions

TermsAndConditions test: We could separate the two sets of assertions in our first test. But in this case, both are part of checking the the proper rendering of the component as a whole and separating them would lead to more unnessessary code duplication. If we specifically wanted to check if there is a checkbox and if there is some text and had a need to test both separately then by all means we could do that. We could even put both separate tests inside a nested desc block to make the separation visually obvious and neatly formatted as part of a single check for correct rendering. desc and it blocks are very flexible that way. But as stated, unnessessary code typing in this case.

In this test we only have 1 button. This is what I don't like about using getByRole without specifying some criteria to mean specifically THIS button and not THAT one in case we were to add another button like in a form with submit and cancel buttons. I prefer to add the name option now so it is future ready and hopefully won't break if we add another button later. Also in this way we don't need to add the additional test toHaveTextContent(/submit/i). Mosh even removes this assertion because as he states, in the future it is possible that this text gets changed.

I'm thinking. If a person on a team is responsible for copy, then maybe the test should fail if they change the text of the button which puts emphasis on double checking the copy and making the test pass before accepting the PR for the change. IDK, just thinking.

### Testing expandable text

To clear the confusion. lorem100 will generate 100 words which in this case is more than 255 characters (the limit set in our component for truncation). I had to look this up in the [emmet docs](https://docs.emmet.io/abbreviations/lorem-ipsum/#:~:text=lorem%20is%20not%20just%20a,a%20100%2Dwords%20dummy%20text.) to see why and how the component was working with lorem100.

Remember that getByRole will throw an error if element not found so technically we don't have to test
that the element is toBeInTheDocument(). Also if using the text in our getByRole, then we don't need to test toHaveTextContent either.

For the last test I had copied the previous test and was testing everything up to the point where we actually need to test if the show less button works. This is unnessessary since the previous tests show that everything else works. So I removed all but getting the button so I have something for the user to click on, and assume the longText is present without redundantly testing for it again.

Still not sure if maybe it is still a good thing to include the toBeInTheDocument part here (below) explicitly to make the test clear even though it is not nessessary

```js

```

const button = screen.getByRole("button", { name: /more/i }); // will throw if not found
expect(button).toBeInTheDocument(); // redundant ?
expect(button).toHaveTextContent(/more/i); // definitely redundant
