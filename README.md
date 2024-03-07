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
const button = screen.getByRole("button", { name: /more/i }); // will throw if not found
expect(button).toBeInTheDocument(); // redundant ?
expect(button).toHaveTextContent(/more/i); // definitely redundant
```

#### more simplifying tests

Notice in TermsAndConditions by introducing a factory to render the component and return all of the
nessessary elements for test, we have greatly simplified the individual test case. As mentioned before, getByRole will throw an error, and each element has at least one test for which we need the element so we can safely remove the toBeInTheDocument assertion from all 3 and the test is still solid and it is still easy to see what we are testing for.

### Exercise testing SearchBox

I felt the code was messy and difficult to read so I moved the keyDown handler code to an explicitly defined handleKeyDown handler function. No big, just preference.

Finally a good example of how getByRole encourages correct accessibility markup. Changed type text to type search and added aria-label which is found as the accessible name property in getByRole.
[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role)

And Mosh chooses this very moment to use something else instead of getByRole lol.
I think Mosh assumes we all know the benifits of getByRole by this point and wants to show us something new. But to me this is the first demonstartion of the actual benifit vs annoyance of using getByRole because it forced me to refactor the production code to follow better accessibility practice. So I'm going to leave it using getByRole.

I also don't think getByPlaceHolder is a very solid test as I see placeholder text as something of very little importance and more likely to change than label text. It is something usually put in as an after thought and therefore ends up getting corrected later after more important things are reviewed/refactored. Then all of a sudden the test breaks because we tested based on placeholder text. I have a strong opinion on this. Sorry, Not Sorry :-)

I feel better after googling. I is not alone... I think I could actually do a proper write up on this topic without sounding dumb. hmm... need to think on that.

### Testing async code TagList

As Mosh brings up and is also in the artilcle I linked above by Kent C Dodds, side effects should NOT be included in the callback for waitFor. In this case the render function is the side effect. Other example in Kent's article. We don't want the side effect to be called multiple times which is what waitFor does with the callback. Also we should have a single assertion inside the callback. Once we have awaited for example an assertion that foo is in the document, then outside and after the waitFor, we can assert everything else that relies on the existense of foo in the document.

Avoid the complexity when waitFor is not needed. Also mentioned by both Kent and Mosh is the fact that findBy* functions use waitFor under the hood. But they are much simpler to write and provide better error messages when there is an error. So prefer to use findBy* methods over waitFor when waitFor is not needed. Examples later in course where waitFor makes sense.

### more async ToastDemo

This would typically be a submit button or some other action creating a toast but for test practice we'll pretend it will always have the word 'toast' as it's accessible text content since I am trying to create strict practice of letting getByRole encourage accessibility.

#### issue 821 matchMedia

Explaination is that jsdom does not have matchMedia so we have to define it
[issue # 821](https://github.com/vitest-dev/vitest/issues/821)
Placed the Define.object code in our setup.ts file and it fixes the issue

Research needed to understand why this became an issue here. Exaclty who is trying to call matchMedia and when in our test. Is it jsdom or the toast lib or what? I'll need to back up and remove things until it stops erroring and read up on [MDN matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

[more info and jest docs workaround here](https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function)

[jest docs](https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom)

Ha! so it is specifically the react-hot-toast lib that needs matchMedia and jsdom which does not have a matchMedia implimentation. react-hot-toasts own project test uses this workaround. [test setup](https://github.com/timolins/react-hot-toast/blob/1f7005356bd419100541a7dcd38d79fad2a2314e/test/setup.ts#L5)

[usage of matchMedia revealed here](https://github.com/timolins/react-hot-toast/blob/1f7005356bd419100541a7dcd38d79fad2a2314e/src/core/utils.ts#L12)

Good info to know because if I remember correctly there will be other times where matchMedia needs to be used to check user preferred system settings such as dark/light mode and others so this won't be the first time I run into this.

### 3rd party component testing

Correction here. OrderStatusSelector it's self is our custom selector. We are using the radix-ui select component as the main part of it. The tests we run on this are not actually testing the radix-ui component but our usage of it to build our own custom selector component. The tests only test that our custom options values and our custom onChange function are used and called correctly.
Keep that in mind. We do not want to actually test the 3rd party lib but we want to test our lib/component/function and how it uses the 3rd party lib/component

OrderStatusSelector is a radix ui component. Radix components should be wrapped in a theme context provider which is provided by the radix ui library so we need to wrap the component in our tests render just like in the production app.

Next problem, missing ResizeObserver API in jsdom, needed by radix ui. We use resize-observer-polyfill to fix. Install as dev dep and then see code in setup.ts. In this case we are not mocking it but putting it in the global space as a polyfill.

Even though the element in the DOM is a button (why I don't like using radix or other such libs), radix gives explicit custom role of combobox. Radix also doesn't give us an aria-label so I added one to Select.Trigger which shows as the buttons aria-label (accessible text)

So getByRole("combobox", { name: /status/i }) works here after I add the aria-role to the trigger.

FYI/FMI Select.Label is to label the group and only shows inside the options group when the box is expanded. So not the same as an aria-label for the entire dropdown selector.

Again with adding things that jsdom does not have
[hasPointerCapture](https://github.com/testing-library/user-event/discussions/1087)

I didn't see a point in moving the getting of the options into the helper function since we only use it once. But if the tests get complicated in the future, we can return a function getOptions() and await and call it at the appropriate time in our tests.

'New' being the default option we can not select it without first selecting another option, then triggering the dropdown again and selecting the new option. So this one has to be done separate but the other 2 options are a good candidate for parameterised test.

# Mocking APIs!

Rather than mock axios or fetch APIs for example, we can mock the server response using MSW which will intercept real requests and respond to them with our mocked response. This way the response stays the same and our tests don't break if and when we change out our client side fetching lib.

## MSW

The basics. See tests/mocks/handlers.ts
Declare an array of handlers/endpoints. Each one consists of a http.method handler which takes a route and a handler function. The handler function handles the request by returning an HttpResponse.json object which is an array of data objects in json format.

Then we use setupServer from msw/node (see tests/mocks/server.ts). Then go to the setup file and start the server before all requests, reset handlers after each test, and then close the server after all requests, using our before and after hooks.

### sidenote for typing fetch requests

[using fetch with typescript](https://kentcdodds.com/blog/using-fetch-with-type-script)

Or login here if purchased and see the TS masters solution [totaltypescript](https://www.totaltypescript.com/workshops/typescript-generics/passing-type-arguments/avoid-any-types-with-generics/solution)

The handlers defined in handlers.ts are the default handlers for the various endpoints but as seen in ProductList.test we can override by defining a handler in the individual test

No Floating Promise lint rule
I've never seen this and I guess it's a good rule to have in place but it requires to explicitly mark
the call in useEffect with the void keyword. Still gotta research this more but that's why I added it. Also correctly typing the axios fetch call took care of several other ts errors inside the useEffect.

### testing ProductDetail

typed the json response and added missing dep to dep array

### using mswjs/data

Now instead of hard coded data we use the factory provided by mswjs/data, a companion package to msw.
See db.ts and how I've modified ProductList.test and ProductDetail.test to create data on the fly.
Especially pay attention to the beforeAll/afterAll hooks. It is important that we don't forget to cleanup after tests so data created in one test suite doesn't polute the global space for the next test suite. mswjs/data has several methods for querying and deleting data just like an actual db orm library (similar to prisma). We can use those in our hooks to make sure the data is restored to the state it was in before the tests start. This way we may want some data to be present from the beginning for all tests ( a default db state ) and only add specific data for specific tests but always be sure to remember and clean up after tests to restore the original state.
