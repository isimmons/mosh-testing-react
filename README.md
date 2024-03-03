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
